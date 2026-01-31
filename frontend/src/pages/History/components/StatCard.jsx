import React from "react";

const StatCard = ({ icon, title, value, label, className = "" }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
