import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({ title, value, onClick }) => {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardCard;
