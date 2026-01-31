import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorState = ({ error, onRetry = null }) => {
  const navigate = useNavigate();

  return (
    <div className="history-page">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h2>Something went wrong</h2>
          <div className="error-message">Error: {error}</div>
          <div className="error-actions">
            <button 
              className="retry-btn" 
              onClick={onRetry || (() => window.location.reload())}
            >
              Try Again
            </button>
            <button 
              className="login-btn" 
              onClick={() => navigate("/login")}
            >
              Please Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;