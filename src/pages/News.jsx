// src/pages/News.jsx 
import React, { useEffect, useState } from "react";
import WeatherWidget from "../components/WeatherWidget";

export default function News() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "2fcffeec899d982b5ea0f944aed6b9bc";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=en&appid=${API_KEY}`
        );
        const data = await res.json();

        const temp = data.main.temp;
        const desc = data.weather[0].description;
        const city = data.name;

        const advice = getPlantAdvice(temp, desc);

        setWeather({
          temp,
          desc,
          city,
          advice,
        });
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const notices = [
    {
      id: 1,
      title: "Humidity was a bit low last night. Mist cycle activated automatically.",
      date: "2025-06-08",
      type: "event",
    },
    {
      id: 2,
      title: "Low night temperatures - keep indoor temperature above 18°C",
      date: "2025-06-07",
      type: "warning",
    },
    {
      id: 3,
      title: "Backend upgraded - recognition speed improved by 20%",
      date: "2025-06-06",
      type: "update",
    },
  ];

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'ElastreInk';
            src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746893218/Elastre_HEXP_INKT_1_zvee53.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <div style={styles.container}>
        <h2 style={styles.h2}>Live Weather Dashboard</h2>
        <WeatherWidget />

        <hr style={{ margin: "30px 0" }} />

        <h2 style={styles.h2}>Outdoor Weather + Planting Advice</h2>
        {loading && <p>Loading weather...</p>}
        {!loading && weather && (
          <div>
            <p>City: {weather.city}</p>
            <p>Temperature: {weather.temp}°C</p>
            <p>Weather: {weather.desc}</p>
            <p>
              Advice: <strong>{weather.advice}</strong>
            </p>

            <hr style={{ margin: "30px 0" }} />
            <h2 style={styles.h2}>System Notices & Events</h2>
            <ul style={styles.noticeList}>
              {notices.map((n) => (
                <li key={n.id} style={styles.noticeItem}>
                  <strong>{n.date}</strong> - {n.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

function getPlantAdvice(temp, desc) {
  if (temp < 10)
    return "Temperature too low - consider heating indoor environment.";
  if (temp > 30)
    return "High temperature - ensure ventilation and hydration.";
  if (desc.includes("rain")) return "Rain forecasted - avoid excessive humidity.";
  if (desc.includes("cloud"))
    return "Cloudy - consider supplemental lighting.";
  return "Conditions are favorable for cultivation.";
}

const styles = {
  container: {
    padding: "114px",
    maxWidth: "720px",
    margin: "0 auto",
    fontFamily: "ElastreInk",
    textAlign: "left",
    transform: "scale(1.3)",
    fontSize: "10px",
  },
  h2: {
    fontSize: "24px", 
    marginBottom: "12px",
  },
  noticeList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  noticeItem: {
    padding: "12px",
    backgroundColor: "hsla(169, 45.70%, 86.30%, 0.60)",
    marginBottom: "8px",
    borderRadius: "8px",
  },
};
