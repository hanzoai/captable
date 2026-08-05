"use client";

import { useEffect, useState } from "react";

const label = (w: number) =>
  w < 640 ? "XS" : w < 768 ? "SM" : w < 1024 ? "MD" : w < 1280 ? "LG" : w < 1536 ? "XL" : "2XL";

const rule: React.CSSProperties = {
  height: "1rem",
  width: "1px",
  background: "#1f2937",
};

const ScreenSize = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const { width, height } = dimensions;

  return (
    <div
      className="font-mono"
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        borderRadius: "9999px",
        background: "#000",
        padding: "0.25rem 0.625rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        color: "#fff",
      }}
    >
      <span>Dev</span>
      <div style={rule} />
      <span>
        {width.toLocaleString()} x {height.toLocaleString()} px
      </span>
      <div style={rule} />
      <span>{label(width)}</span>
    </div>
  );
};

export default ScreenSize;
