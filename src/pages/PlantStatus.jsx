import React, { useEffect, useState } from "react";

const stageMap = {
  seedling: 20,
  vegetative: 40,
  growing: 60,
  fruiting: 80,
  mature: 100,
};

const predictionMap = {
  "Pepper__bell___Bacterial_spot": "Bacterial spot",
  "Pepper__bell___healthy": "Healthy",
  "Potato___Early_blight": "Early blight",
  "Potato___healthy": "Healthy",
  "Potato___Late_blight": "Late blight",
  "Tomato__Target_Spot": "Target Spot",
  "Tomato__Tomato_mosaic_virus": "Mosaic virus",
  "Tomato__Tomato_YellowLeaf__Curl_Virust": "YellowLeaf Curl Virus",
  "Tomato_Bacterial_spot": "Bacterial spot",
  "Tomato_Early_blight": "Early blight",
  "Tomato_healthy": "Healthy",
  "Tomato_Late_blight": "Late blight",
  "Tomato_Leaf_Mold": "Leaf Mold",
  "Tomato_Septoria_leaf_spot": "Septoria leaf spot",
  "Tomato_Spider_mites_Two_spotted_spider_mite": "Two spotted spider mite",
};

export default function PlantStatus() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://backend-1-ku7v.onrender.com/predictions?limit=1")
      .then((res) => res.json())
      .then((json) => setData(json[0]))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  const { growthStage, prediction } = data;
  const readablePrediction = predictionMap[prediction] || prediction;

  let progress = stageMap[growthStage] || 0;
  let progressLabel = `${growthStage} - ${progress}%`;

  if (growthStage === "seedling") {
    progress = 30;
    progressLabel = "seedling - 30%";
  } else if (growthStage === "mature") {
    progress = 60;
    progressLabel = "mature - 60%";
  }

  const hasPest = !prediction?.toLowerCase().includes("healthy");

  const isHappy = !hasPest && progress >= 40;
  const moodMessage = isHappy
    ? " Your plant is happy and growing well!"
    : "Your plant may be stressed. Check pests or care conditions.";

  return (
    <div style={styles.backgroundWrapper}>
      <style>
        {`
          @font-face {
            font-family: 'ElastreInk';
            src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746893218/Elastre_HEXP_INKT_1_zvee53.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          body {
            margin: 0;
            overflow: hidden;
          }
        `}
      </style>

      <img src="/image/rock3.png" alt="Background" style={styles.backgroundImage} />

      <div style={styles.wrapper}>
        <h2 style={styles.title}>Current Plant Status</h2>

        <div style={styles.panel}>
          <div style={styles.label}>Growth Stage</div>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }}>
              {progressLabel}
            </div>
          </div>
        </div>

        
        <div
          style={{
            backgroundColor: "#BDFE00",
            borderRadius: "1rem",
            padding: "1rem 3rem",
            marginBottom: "-6rem",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%) scale(0.66)",
            zIndex: 2,
            minWidth: "240px",
          }}
        >
          <div style={{ display: "flex", gap: "2rem" }}>
           
            <button
              onClick={() => (window.location.href = "/plant-status")}
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.15)";
                e.target.style.textShadow = "0 0 8px #004C01";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.textShadow = "none";
              }}
            >
              Status
            </button>

           
            <button
              onClick={() => (window.location.href = "/dashboard")}
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.15)";
                e.target.style.textShadow = "0 0 8px #004C01";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.textShadow = "none";
              }}
            >
              Dashboard
            </button>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Plant Status</div>
          <button
            style={{
              ...styles.pestButton,
              backgroundColor: hasPest ? "#BDFE00" : "#004C01",
              color: hasPest ? "#004C01" : "white",
            }}
          >
            {hasPest ? `Pest Detected: ${readablePrediction}` : `Plant Condition: ${readablePrediction}`}
          </button>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Plant Mood</div>
          <div style={styles.moodText}>{moodMessage}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backgroundWrapper: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  wrapper: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "'ElastreInk', sans-serif",
    position: "relative",
    zIndex: 1,
    color: "#000",
  },
  title: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "30px",
  },
  panel: {
    backgroundColor: "hsla(169, 45.70%, 86.30%, 0.60)",
    backdropFilter: "blur(6px)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  progressContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    height: "24px",
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#BDFE00",
    color: "#000",
    height: "24px",
    lineHeight: "24px",
    textAlign: "center",
    transition: "width 0.4s",
    fontSize: "12px",
  },
  pestButton: {
    padding: "10px 20px",
    fontWeight: "normal",
    border: "none",
    borderRadius: "8px",
    cursor: "default",
    fontSize: "12px",
  },
  moodText: {
    fontSize: "12px",
    fontWeight: "normal",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "#004C01",
    fontFamily: "'ElastreInk', sans-serif",
    fontSize: "18px",
    cursor: "pointer",
    height: "40px",
    transition: "all 0.3s ease",
    padding: "0 10px",
  },
};



