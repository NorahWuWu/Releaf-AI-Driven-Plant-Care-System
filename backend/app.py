from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "2b10PfiK3MxZOuzWCqY4YWutBu"  # 替换为你自己的 PlantNet API Key

@app.route('/identify', methods=['POST'])
def identify():
    try:
        data = request.get_json(force=True)  # ✅ 接收 JSON 格式
        image_base64 = data.get("image")
        organ = data.get("organ", "leaf")

        if not image_base64:
            return jsonify({"error": "Missing image data"}), 400

        print(f"接收到识别请求，图片长度：{len(image_base64)}, 器官类型：{organ}")

        url = f"https://my-api.plantnet.org/v2/identify/all?api-key={API_KEY}"
        payload = {
            "images": [image_base64],
            "organs": [organ]
        }
        params = {
            "lang": "zh",
            "nb-results": 5,
            "no-reject": True,
            "include-related-images": False
        }

        response = requests.post(url, json=payload, params=params)
        result = response.json()
        print("识别返回：", result)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
