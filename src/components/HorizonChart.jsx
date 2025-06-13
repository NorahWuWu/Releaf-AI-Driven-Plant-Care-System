import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../observable/b9ba43b219dab170@655.js";

export default function HorizonChart() {
  const bandsRef = useRef();
  const variableRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    const main = runtime.module(notebook, name => {
      if (name === "viewof bands") return new Inspector(bandsRef.current);
      if (name === "viewof variable") return new Inspector(variableRef.current);
      if (name === "chart") return new Inspector(chartRef.current);
      return true;
    });
    return () => runtime.dispose();
  }, []);

  return (
    <div style={{ marginBottom: "40px" }}>
      <div ref={bandsRef} />
      <div ref={variableRef} />
      <div ref={chartRef} />
      <p style={{ fontSize: "12px", textAlign: "right" }}>
        Credit:{" "}
        <a
          href="https://observablehq.com/d/b9ba43b219dab170"
          target="_blank"
          rel="noopener noreferrer"
        >
          ObservableHQ
        </a>
      </p>
    </div>
  );
}
