import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <h1 style={{ color: "white" }}>LOADING...</h1>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
