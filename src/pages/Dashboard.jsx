import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [deviceData, setDeviceData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceIDs, setDeviceIDs] = useState([]);

  const endpoint = "https://esp-plant-dashboard.onrender.com/data";

  useEffect(() => {
    fetchData(selectedDevice);
  }, [selectedDevice]);

  async function fetchData(deviceID = "") {
    let data = [];

    if (deviceID) {
      const res = await fetch(`${endpoint}?deviceID=${deviceID}`);
      data = await res.json();
    } else {
     
      const res1 = await fetch(`${endpoint}?deviceID=ESP32-05`);
      const res2 = await fetch(`${endpoint}?deviceID=ESP32-07`);
      const data1 = await res1.json();
      const data2 = await res2.json();
      data = [...data1, ...data2];
    }

    setDeviceData(data);

    if (!deviceID) {
      const uniqueIDs = [...new Set(data.map((d) => d.deviceID))];
      setDeviceIDs(uniqueIDs);
    }

    updateChart(data);
  }

  function updateChart(data) {
    const labels = data.map((d) => new Date(d.timestamp).toLocaleString());
    const values = data.map((d) => d.avgMoisture);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels;
      chartInstanceRef.current.data.datasets[0].data = values;
      chartInstanceRef.current.update();
    } else {
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Moisture",
              data: values,
              borderColor: "green",
              backgroundColor: "lightgreen",
              tension: 0.3,
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  family: "Elastre",
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
                font: { family: "Elastre" },
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                font: { family: "Elastre" },
              },
            },
            y: {
              title: {
                display: true,
                text: "Moisture",
                font: { family: "Elastre" },
              },
              ticks: { font: { family: "Elastre" } },
            },
          },
        },
      });
    }
  }

  return (
    <div
      style={{
        fontFamily: "Elastre",
        backgroundColor: "#f5f5f5",
        padding: "40px",
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

          select {
            font-size: 22px;
            padding: 5px;
            margin-bottom: 20px;
            display: block;
            font-family: Elastre, sans-serif;
          }

          canvas {
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
          }

          h1, h2, label {
            font-family: Elastre, sans-serif;
          }
        `}
      </style>

      
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "100px",
          zIndex: 10,
          backgroundColor: "#BDFE00",
          borderRadius: "12px",
          padding: "14px 20px",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => (window.location.href = "/plant-status")}
          style={{
            background: "transparent",
            border: "none",
            color: "#004C01",
            fontFamily: "Elastre, sans-serif",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
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
          style={{
            background: "transparent",
            border: "none",
            color: "#004C01",
            fontFamily: "Elastre, sans-serif",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
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

      <h1>Polka Dot Growth Horizon</h1>

<iframe width="100%" height="594" frameborder="0"
  src="https://observablehq.com/embed/b9ba43b219dab170?cells=viewof+bands%2Cviewof+variable%2Cchart"></iframe>

      
      

    
      <div
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#f5f5f5",
          marginTop: "-60px",
          position: "relative",
          zIndex: 1,
        }}
      />

      <h2 style={{ marginTop: "20px", fontSize: "2em" }}>
        Moisture Data Dashboard
      </h2>

      <label
        htmlFor="deviceSelect"
        style={{
          fontSize: "0.8em",
          marginBottom: "6px",
          display: "inline-block",
        }}
      >
        Choose a device:
      </label>
      <select
        id="deviceSelect"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        <option value="">All Devices</option>
        {deviceIDs.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      <canvas id="chart" ref={chartRef} width="1000" height="400"></canvas>
    </div>
  );
}
