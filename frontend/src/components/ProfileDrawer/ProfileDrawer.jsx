import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDrawer.scss";

const ProfileDrawer = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      {/* Backdrop/Overlay */}
      {isOpen && <div className="drawer-backdrop" onClick={onClose}></div>}

      {/* Drawer */}
      <div className={`profile-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>My Account</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="profile-info">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="avatar-badge">✓</div>
            </div>
            <div className="profile-details">
              <p className="profile-name">{user.name || "User"}</p>
              <p className="profile-email">
                {user.email || "user@example.com"}
              </p>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-icon">🛍️</div>
              <div className="stat-info">
                <p className="stat-label">Purchases</p>
                <p className="stat-value">View History</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <p className="stat-label">Savings</p>
                <p className="stat-value">View Dashboard</p>
              </div>
            </div>
          </div>

          <div className="drawer-menu">
            <button
              className="menu-item"
              onClick={() => {
                navigate("/history");
                onClose();
              }}
            >
              <span className="menu-icon">📋</span>
              <span className="menu-text">Purchase History</span>
              <span className="menu-arrow">›</span>
            </button>
            <button
              className="menu-item"
              onClick={() => {
                navigate("/dashboard");
                onClose();
              }}
            >
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
              <span className="menu-arrow">›</span>
            </button>
            <button
              className="menu-item seller"
              onClick={() => {
                alert("Seller portal coming soon! 🏪");
                // navigate("/seller");
                // onClose();
              }}
            >
              <span className="menu-icon">🏪</span>
              <span className="menu-text">Login as Seller</span>
              <span className="menu-arrow">›</span>
            </button>
            <button className="menu-item logout" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
