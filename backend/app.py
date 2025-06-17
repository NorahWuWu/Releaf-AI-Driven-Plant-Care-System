from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS
from pymongo import MongoClient, errors
from datetime import datetime, timedelta
import os
import io
import csv
import re
import logging
import base64
import requests

app = Flask(__name__)
CORS(app)

# 日志配置
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ESPPlantBackend")

# ✅ MongoDB 连接
MONGO_URI = "mongodb+srv://student:austral-clash-sawyer-blaze@espplantcluster.3yopiy3.mongodb.net/?retryWrites=true&w=majority&appName=ESPPlantCluster"
if not MONGO_URI:
    logger.error("MongoDB URI not found in environment variables")
    raise RuntimeError("MongoDB URI must be set in environment variables")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["esp_data"]
    collection = db["moisture_readings"]
    prediction_collection = db["plant_predictions"]
    logger.info("✅ Successfully connected to MongoDB")
except errors.ServerSelectionTimeoutError as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise RuntimeError("Database connection failed") from e

# 常量设置
MAX_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_device_id(device_id):
    return re.match(r'^ESP32_[A-Z0-9]{6}$', device_id) is not None

# ✅ 上传湿度或识别数据
@app.route("/upload", methods=["POST"])
def upload_data():
    try:
        if request.content_type.startswith("multipart/form-data"):
            form = request.form
            device_id = form.get("deviceID")
            prediction = form.get("prediction")
            growth_stage = form.get("growthStage")
            timestamp_str = form.get("timestamp")

            if not all([device_id, prediction, growth_stage, timestamp_str]):
                return jsonify({"error": "Missing required fields"}), 400
            if not validate_device_id(device_id):
                return jsonify({"error": "Invalid device ID format"}), 400
            try:
                timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                return jsonify({"error": "Invalid timestamp format. Use YYYY-MM-DD HH:MM:SS"}), 400

            image = request.files.get("image")
            image_filename = None
            if image:
                if image.content_length > MAX_IMAGE_SIZE:
                    return jsonify({"error": "Image exceeds 5MB size limit"}), 413
                if not allowed_file(image.filename):
                    return jsonify({"error": "Invalid image type"}), 400

                os.makedirs("uploads", exist_ok=True)
                filename = f"{device_id}_{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
                image_path = os.path.join("uploads", filename)
                image.save(image_path)
                image_filename = filename

            data = {
                "deviceID": device_id,
                "prediction": prediction,
                "growthStage": growth_stage,
                "timestamp": timestamp,
                "serverTimestamp": datetime.utcnow(),
                "date": datetime.utcnow().strftime("%Y-%m-%d")
            }
            if image_filename:
                data["imageFilename"] = image_filename
            prediction_collection.insert_one(data)
            return jsonify({"message": "Prediction data stored"}), 200

        else:
            data = request.get_json()
            if not data or "deviceID" not in data or "avgMoisture" not in data:
                return jsonify({"error": "Invalid payload. Requires deviceID and avgMoisture"}), 400
            if not validate_device_id(data["deviceID"]):
                return jsonify({"error": "Invalid device ID format"}), 400

            now = datetime.utcnow()
            data["timestamp"] = now
            data["serverTimestamp"] = now
            data["date"] = now.strftime("%Y-%m-%d")
            collection.insert_one(data)
            return jsonify({"message": "Moisture data stored"}), 200

    except Exception as e:
        logger.error(f"Upload failed: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

# ✅ 获取识别数据
@app.route("/predictions", methods=["GET"])
def get_predictions():
    try:
        device_id = request.args.get("deviceID")
        limit = int(request.args.get("limit", 100))
        query = {"deviceID": device_id} if device_id else {}

        if days := request.args.get("days"):
            try:
                days = int(days)
                time_filter = {"timestamp": {"$gte": datetime.utcnow() - timedelta(days=days)}}
                query.update(time_filter)
            except ValueError:
                pass

        projection = {"_id": 0}
        data = list(prediction_collection.find(query, projection).sort("timestamp", -1).limit(limit))
        for item in data:
            if "imageFilename" in item:
                item["imageUrl"] = f"/image/{item['imageFilename']}"
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# ✅ 获取湿度数据
@app.route("/data", methods=["GET"])
def get_data():
    try:
        device_id = request.args.get("deviceID")
        limit = int(request.args.get("limit", 500))
        query = {"deviceID": device_id} if device_id else {}

        if hours := request.args.get("hours"):
            try:
                hours = int(hours)
                time_filter = {"timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}}
                query.update(time_filter)
            except ValueError:
                pass

        projection = {"_id": 0}
        data = list(collection.find(query, projection).sort("timestamp", -1).limit(limit))
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# ✅ 下载湿度数据 CSV
@app.route("/download", methods=["GET"])
def download_csv():
    try:
        device_id = request.args.get("deviceID")
        if not device_id:
            return jsonify({"error": "deviceID is required"}), 400

        query = {"deviceID": device_id}
        if start_date := request.args.get("start"):
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                query["date"] = {"$gte": start_date}
            except ValueError:
                pass

        data = list(collection.find(query, {"_id": 0}))
        if not data:
            return jsonify({"error": "No data found"}), 404

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

        output.seek(0)
        filename = f"moisture_data_{device_id}_{datetime.utcnow().strftime('%Y%m%d')}.csv"
        return send_file(io.BytesIO(output.getvalue().encode()), mimetype="text/csv", as_attachment=True, download_name=filename)

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# ✅ 获取图片
@app.route("/image/<filename>", methods=["GET"])
def get_image(filename):
    try:
        if ".." in filename or filename.startswith("/"):
            abort(400, "Invalid filename")

        path = os.path.join("uploads", filename)
        if not os.path.exists(path):
            abort(404, "Image not found")

        return send_file(path, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# ✅ 清理旧数据
@app.route("/cleanup", methods=["POST"])
def cleanup_data():
    try:
        days = int(request.json.get("days", 30))
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        moisture_result = collection.delete_many({"timestamp": {"$lt": cutoff_date}})
        prediction_result = prediction_collection.delete_many({"timestamp": {"$lt": cutoff_date}})

        image_count = 0
        for filename in os.listdir("uploads"):
            filepath = os.path.join("uploads", filename)
            file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
            if file_time < cutoff_date:
                os.remove(filepath)
                image_count += 1

        return jsonify({
            "message": "Cleanup completed",
            "deleted_moisture": moisture_result.deleted_count,
            "deleted_predictions": prediction_result.deleted_count,
            "deleted_images": image_count
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# ✅ 植物识别（调用 PlantNet API）
PLANTNET_API_KEY = "2b10ZSp5MnAcTFcGK7zHsHu"

@app.route("/identify", methods=["POST"])
def identify_plant():
    try:
        data = request.get_json()
        base64_image = data.get("image")
        organ = data.get("organ", "leaf")

        if not base64_image:
            return jsonify({"error": "Image is required"}), 400

        image_bytes = base64.b64decode(base64_image)

        files = {
            "images": ("plant.jpg", image_bytes, "image/jpeg")
        }
        payload = {
            "organs": organ
        }
        params = {
            "api-key": PLANTNET_API_KEY
        }

        response = requests.post("https://my-api.plantnet.org/v2/identify/all", files=files, data=payload, params=params)
        if response.status_code != 200:
            return jsonify({"error": "PlantNet API error", "status_code": response.status_code}), 500

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": "PlantNet API call failed", "message": str(e)}), 500

# ✅ 启动服务
if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    logger.info("Starting server on 0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)
