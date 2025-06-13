import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Recognition() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [organ, setOrgan] = useState("leaf");
  const [latestImageUrl, setLatestImageUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate();

  const BACKEND_URL = "https://backend-1-ku7v.onrender.com";

  useEffect(() => {
    document.body.style.overflow = "hidden";

    async function loadLatestImage() {
      try {
        const response = await fetch(`${BACKEND_URL}/predictions?limit=1`);
        const data = await response.json();

        if (data.length === 0 || !data[0].imageUrl) {
          setError("No image found from device.");
          return;
        }

        const imageUrl = `${BACKEND_URL}${data[0].imageUrl}`;
        setLatestImageUrl(imageUrl);

        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          identifyPlant(base64);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        setError("Failed to fetch latest image: " + err.message);
      }
    }

    loadLatestImage();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const identifyPlant = async (base64) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, organ }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.message || data.error);
      if (!Array.isArray(data.results) || data.results.length === 0) {
        setError("No plant detected. Try a clearer photo.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Recognition failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      identifyPlant(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        fontFamily: "Elastre, sans-serif",
        backgroundColor: "#CCECE6",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>
        {`
          @font-face {
            font-family: 'Elastre';
            src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746886734/Elastre_HEXP_INKT_vfwhma.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <button
        onClick={() => navigate("/care-solution")}
        style={{
          position: "absolute",
          top: "12px",
          right: "90px",
          padding: "10px 12px",
          backgroundColor: "#BDFE00",
          color: "#004C01",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "Elastre, sans-serif",
        }}
      >
        Care Solution &gt;&gt;&gt;
      </button>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          padding: "30px",
          borderRadius: "16px",
          width: "400px",
          boxShadow: "0 4px 32px rgba(13, 255, 231, 0.6)",
          color: "#004C01",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>Plant Recognition</h2>

        <label style={{ display: "block", marginBottom: "12px", fontSize: "14px" }}>
          Organ:
          <select
            value={organ}
            onChange={(e) => setOrgan(e.target.value)}
            style={{
              marginLeft: "10px",
              fontSize: "14px",
              padding: "4px 8px",
              fontFamily: "Elastre, sans-serif",
            }}
          >
            <option value="leaf">Leaf</option>
            <option value="flower">Flower</option>
            <option value="fruit">Fruit</option>
            <option value="bark">Bark</option>
          </select>
        </label>

        {latestImageUrl && (
          <img
            src={latestImageUrl}
            alt="Latest Plant"
            style={{
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />
        )}

        <label
          htmlFor="customFileUpload"
          style={{
            backgroundColor: "#BDFE00",
            padding: "8px 16px",
            color: "#004C01",
            borderRadius: "8px",
            cursor: "pointer",
            display: "inline-block",
            fontFamily: "Elastre, sans-serif",
            fontSize: "14px",
          }}
        >
          Upload Image
        </label>
        <input
          id="customFileUpload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
          style={{ display: "none" }}
        />
        <span style={{ marginLeft: "10px", fontSize: "14px" }}>
          {selectedFileName || "No file selected"}
        </span>

        {error && (
          <div style={{ marginTop: "15px", color: "red", fontSize: "14px" }}>
            <strong>{error}</strong>
          </div>
        )}

        {loading && (
          <div style={{ marginTop: "15px", fontSize: "14px" }}>
            <strong>Identifying...</strong>
          </div>
        )}

        {result?.results?.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Top Match:</h3>
            <div>
              <strong>Scientific Name:</strong> {result.results[0].species?.scientificName || "Unknown"} <br />
              <strong>Genus:</strong> {result.results[0].species?.genus?.scientificName || "None"} <br />
              <strong>Family:</strong> {result.results[0].species?.family?.scientificName || "None"} <br />
              <strong>Similarity:</strong> {Math.round(result.results[0].score * 100)}% <br />
              <strong>Common Names:</strong> {result.results[0].species?.commonNames?.join(", ") || "None"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

