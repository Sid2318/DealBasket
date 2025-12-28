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
          <h3>Profile Menu</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="profile-info">
            <div className="profile-avatar">👤</div>
            <div className="profile-details">
              <p className="profile-name">{user.name}</p>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <div className="drawer-menu">
            <button className="menu-item" onClick={handleLogout}>
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
