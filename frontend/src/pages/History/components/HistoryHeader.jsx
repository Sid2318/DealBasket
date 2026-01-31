import React from "react";
import { useNavigate } from "react-router-dom";

const HistoryHeader = ({
  title = "Purchase History",
  subtitle = "Track your savings and previous purchases",
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="header-content">
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default HistoryHeader;
