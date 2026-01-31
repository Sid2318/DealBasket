import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyState = ({
  icon = "🛍️",
  title = "No Purchase History",
  message = "Start shopping to see your purchase history and savings!",
  buttonText = "Start Shopping",
  onButtonClick = null,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      <button className="shop-btn" onClick={handleButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;
