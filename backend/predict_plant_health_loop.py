import cv2
import os
import time
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import requests
import tensorflow as tf
import numpy as np
from datetime import datetime

# ✅ 设备配置
device_id = "RPi-01"
server_url = "http://127.0.0.1:5000/upload"  # 可改为公网地址
capture_interval = 30  # 每 30 秒执行一次

# ✅ 类别标签
class_names = [
    "Pepper__bell___Bacterial_spot", "Pepper__bell___healthy",
    "Potato___Early_blight", "Potato___healthy", "Potato___Late_blight",
    "Tomato__Target_Spot", "Tomato__Tomato_mosaic_virus", "Tomato__Tomato_YellowLeaf__Curl_Virust",
    "Tomato_Bacterial_spot", "Tomato_Early_blight", "Tomato_healthy",
    "Tomato_Late_blight", "Tomato_Leaf_Mold", "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite"
]
growth_classes = ["seedling", "mature"]

# ✅ 读取模型文件路径
base_dir = os.path.dirname(__file__)
model_pth_path = os.path.join(base_dir, "bestone_0.2698.pth")
growth_model_path = os.path.join(base_dir, "plant_growth_model.h5")

# ✅ 加载 PyTorch 模型
torch_device = torch.device("cpu")
num_classes = len(class_names)
torch_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

print("📦 正在加载 PyTorch 模型...")
if not os.path.exists(model_pth_path):
    raise FileNotFoundError(f"❌ 模型文件未找到: {model_pth_path}")
pytorch_model = models.resnet18()
pytorch_model.fc = nn.Linear(pytorch_model.fc.in_features, num_classes)
pytorch_model.load_state_dict(torch.load(model_pth_path, map_location=torch_device))
pytorch_model = pytorch_model.to(torch_device)
pytorch_model.eval()
print("✅ PyTorch 模型加载完成")

# ✅ 加载 TensorFlow 模型
print("📦 正在加载 TensorFlow 模型...")
if not os.path.exists(growth_model_path):
    raise FileNotFoundError(f"❌ TensorFlow 模型文件未找到: {growth_model_path}")
tf_model = tf.keras.models.load_model(growth_model_path)
print("✅ TensorFlow 模型加载完成")

print("\n🚀 开始识别循环，每 30 秒拍照并上传...\n按 Ctrl+C 停止")

while True:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    safe_timestamp = timestamp.replace(":", "-").replace(" ", "_")
    img_path = f"plant_{safe_timestamp}.jpg"

    # 📸 拍照
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(img_path, frame)
        print(f"\n📷 拍摄成功：{img_path}")
    else:
        print("❌ 摄像头拍照失败")
        cap.release()
        time.sleep(capture_interval)
        continue
    cap.release()

    # 🌿 病虫害识别（PyTorch）
    try:
        image_pil = Image.open(img_path).convert("RGB")
        input_tensor = torch_transform(image_pil).unsqueeze(0).to(torch_device)
        with torch.no_grad():
            output = pytorch_model(input_tensor)
            _, pred = torch.max(output, 1)
        health_status = class_names[pred.item()]
        print(f"🌿 健康状态识别结果：{health_status}")
    except Exception as e:
        print(f"❌ 病虫害识别失败：{e}")
        health_status = "unknown"

    # 🌱 生长阶段识别（TensorFlow）
    try:
        img = cv2.imread(img_path)
        img_resized = cv2.resize(img, (224, 224)) / 255.0
        img_input = np.expand_dims(img_resized, axis=0)
        growth_pred = tf_model.predict(img_input, verbose=0)[0]
        growth_label = growth_classes[np.argmax(growth_pred)]
        print(f"🌱 生长阶段识别结果：{growth_label}")
    except Exception as e:
        print(f"❌ 生长阶段识别失败：{e}")
        growth_label = "unknown"

    # 📤 上传数据
    payload = {
        "deviceID": device_id,
        "timestamp": timestamp,
        "prediction": health_status,
        "growthStage": growth_label
    }

    success = False
    for attempt in range(3):
        try:
            with open(img_path, "rb") as image_file:
                files = {"image": image_file}
                response = requests.post(server_url, data=payload, files=files, timeout=5)

            if response.status_code == 200:
                print(f"✅ 上传成功：{response.status_code} - {response.text}")
                success = True
                break
            else:
                print(f"⚠️ 上传失败（状态码 {response.status_code}）：{response.text}")
        except Exception as e:
            print(f"⚠️ 上传异常（第 {attempt + 1} 次）：{e}")
            time.sleep(2)

    if success:
        os.remove(img_path)
        print(f"🧹 已删除图片：{img_path}")
    else:
        print(f"🚫 本轮上传失败，保留图片：{img_path}")

    time.sleep(capture_interval)
