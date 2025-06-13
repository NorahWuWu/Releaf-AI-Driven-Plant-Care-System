// src/pages/Me.jsx

import React, { useState } from "react";

export default function Me() {
  const [mode, setMode] = useState("Auto");

  const user = {
    name: "Norah",
    plant: "Polka Dot Plant",
    registered: "2025-06-01",
    progress: 30,
    lastManualAction: "6 days ago",
    wateringCount: 3,
  };

  return (
    <>
<style>
  {`
    @font-face {
      font-family: 'Elastre';
      src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746893218/Elastre_HEXP_INKT_1_zvee53.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    body {
      margin: 0;
      padding: 0;
      background-color:rgb(255, 255, 255);
      position: relative;
      z-index: 0;
    }

    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: url("/image/logo2.png") no-repeat center top;
      background-size: cover;
      opacity: 0.6;
      z-index: -1;
      pointer-events: none;
    }

    h2 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    p, li, button, textarea {
      font-size: 12px;
    }
  `}
</style>


      <div style={styles.container}>
        <h1 style={styles.header}>My Profie</h1>

        <section style={styles.card}>
          <h2>User Info</h2>
          <p>Name: {user.name}</p>
          <p>Plant: {user.plant}</p>
          <p>Mode: <span style={styles.modeText}>{mode}</span></p>
          <p>Registered: {user.registered}</p>
        </section>

        <section style={styles.card}>
          <h2>Growth Progress</h2>
          <p>Your {user.plant} is {user.progress}% through its cycle.</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${user.progress}%` }} />
          </div>
        </section>

        <section style={styles.card}>
          <h2>Personal Achievement</h2>
          <ul>
            <li>Watered {user.wateringCount} times</li>
            <li>Last manual action: {user.lastManualAction}</li>
            <li>Growth Progress: {user.progress}%</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2>Setting</h2>
          <p>Current Mode: <span style={styles.modeText}>{mode}</span></p>
          <button
            style={mode === "Auto" ? styles.autoBtn : styles.manualBtn}
            onClick={() => setMode(mode === "Auto" ? "Manual" : "Auto")}
          >
            {mode === "Auto" ? "Switch to Manual" : "Switch to Auto"}
          </button>
        </section>

        <section style={styles.card}>
          <h2>Feedback & Solution</h2>
          <p>Tell us what you think:</p>
          <textarea
            placeholder="Have thoughts about your plant's care? Share them here..."
            style={styles.textarea}
          />
          <br />
          <button onClick={() => alert("Feedback submitted. Thank you for your feedback, we received and will process it soon!")}>
            Submit Feedback
          </button>
        </section>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "720px",
    margin: "0 auto",
    fontFamily: "'Elastre', sans-serif",
    fontSize: "12px",
  },
  header: {
    fontSize: "30px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "hsla(169, 45.7%, 86.3%, 0.6)",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  progressBar: {
    backgroundColor: "#ffffff",
    color: "#000",
    height: "24px",
    lineHeight: "24px",
    textAlign: "center",
    transition: "width 0.4s",
    fontSize: "12px",
    borderRadius: "20px",
  },
  progressFill: {
    backgroundColor: "#004C01",
    height: "100%",
    borderRadius: "16px 0 0 16px",
  },
  textarea: {
    width: "96%",
    height: "80px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "8px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  modeText: {
    color: "#000",
    fontWeight: "bold",
  },
  autoBtn: {
    backgroundColor: "#004C01",
    color: "#BDFE00",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontWeight: "bold",
  },
  manualBtn: {
    backgroundColor: "#BDFE00",
    color: "#004C01",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontWeight: "bold",
  },
};

