import { useEffect } from "react";

export default function WeatherWidget() {
  useEffect(() => {
    window.myWidgetParam = window.myWidgetParam || [];
    window.myWidgetParam.push({
      id: 1,
      cityid: "2643743", // London
      appid: "2fcffeec899d982b5ea0f944aed6b9bc",
      units: "metric",
      containerid: "openweathermap-widget-1",
    });

    const scriptId = "owm-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={styles.outerGlow}>
      <div style={styles.innerWrapper}>
        <div id="openweathermap-widget-1" style={styles.widgetBox} />
      </div>
    </div>
  );
}

const styles = {
  outerGlow: {
    padding: "px", 
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 36px rgba(13, 255, 231, 0.6)", 
    display: "inline-block",
    maxWidth: "100%",
  },
  innerWrapper: {
    borderRadius: "10px",
    overflow: "hidden", 
  },
  widgetBox: {
    transform: "scale(1)", 
    margin: 0,
  },
};
