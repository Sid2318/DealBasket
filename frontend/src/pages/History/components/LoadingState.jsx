import React from "react";

const LoadingState = ({ message = "Loading History..." }) => {
  return (
    <div className="history-page">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default LoadingState;
