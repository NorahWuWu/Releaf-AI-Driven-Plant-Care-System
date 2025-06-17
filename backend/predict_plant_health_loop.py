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

# ✅ Device configuration
device_id = "ESP32_ABC123"
server_url = "https://backend-1-ku7v.onrender.com/upload"

capture_interval = 30  # Capture every 30 seconds

# ✅ Class labels
class_names = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___healthy",
    "Potato___Late_blight",
    "Tomato__Target_Spot",
    "Tomato__Tomato_mosaic_virus",
    "Tomato__Tomato_YellowLeaf__Curl_Virust",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_healthy",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite"
]

growth_classes = ["seedling", "mature"]

# ✅ PyTorch configuration
torch_device = torch.device("cpu")
num_classes = len(class_names)
torch_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

pytorch_model = models.resnet18()
pytorch_model.fc = nn.Linear(pytorch_model.fc.in_features, num_classes)
pytorch_model.load_state_dict(torch.load("bestone_0.2698.pth", map_location=torch_device))
pytorch_model = pytorch_model.to(torch_device)
pytorch_model.eval()

# ✅ TensorFlow configuration
tf_model = tf.keras.models.load_model("plant_growth_model.h5")

print("\U0001F680 Starting loop: capturing, recognizing, and uploading every 30 seconds...\nPress Ctrl+C to stop")

while True:
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    safe_timestamp = timestamp.replace(":", "-").replace(" ", "_")
    img_path = f"plant_{safe_timestamp}.jpg"

    # 📸 Capture image
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(img_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 70])  # ✅ Compress image
        print(f"\n📷 Image captured: {img_path}")
    else:
        print("❌ Failed to capture image from camera")
        cap.release()
        time.sleep(capture_interval)
        continue
    cap.release()

    # 🌿 Health prediction (PyTorch)
    image_pil = Image.open(img_path).convert("RGB")
    input_tensor = torch_transform(image_pil).unsqueeze(0).to(torch_device)
    with torch.no_grad():
        output = pytorch_model(input_tensor)
        _, pred = torch.max(output, 1)
        health_status = class_names[pred.item()]
    print(f"🌿 Health prediction: {health_status}")

    # 🌱 Growth stage prediction (TensorFlow)
    img = cv2.imread(img_path)
    img_resized = cv2.resize(img, (224, 224)) / 255.0
    img_input = np.expand_dims(img_resized, axis=0)
    growth_pred = tf_model.predict(img_input, verbose=0)[0]
    growth_label = growth_classes[np.argmax(growth_pred)]
    print(f"🌱 Growth stage prediction: {growth_label}")

    # 📤 Prepare payload for upload
    payload = {
        "deviceID": device_id,
        "timestamp": timestamp,
        "prediction": health_status,
        "growthStage": growth_label
    }

    # 🛜 Upload with retry logic
    max_retries = 3
    success = False
    for attempt in range(max_retries):
        try:
            with open(img_path, "rb") as image_file:
                files = {"image": image_file}
                response = requests.post(server_url, data=payload, files=files, timeout=30)

            if response.status_code == 200:
                print(f"✅ Upload successful: {response.status_code} - {response.text}")
                success = True
                break
            else:
                print(f"⚠️ Upload failed (status {response.status_code}): {response.text}")
        except Exception as e:
            print(f"⚠️ Upload attempt {attempt + 1} failed: {e}")
            time.sleep(2)

    # ✅ Delete image if upload successful
    if success:
        os.remove(img_path)
        print(f"🧹 Image deleted: {img_path}")
    else:
        print(f"🚫 Upload failed, image retained for troubleshooting")

    time.sleep(capture_interval)
