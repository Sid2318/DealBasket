import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.scss";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-icon">🔒</div>

        <h2>Login Required</h2>
        <p>Please login to explore more functionalities of DealBasket</p>

        <div className="modal-features">
          <div className="feature">✓ Buy products and track savings</div>
          <div className="feature">✓ View purchase history</div>
          <div className="feature">✓ Access personalized dashboard</div>
          <div className="feature">✓ Get exclusive deals</div>
        </div>

        <div className="modal-actions">
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="signup-btn" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
