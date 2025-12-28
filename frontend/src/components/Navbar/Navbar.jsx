import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    // Custom event for same-tab login/logout
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // Dispatch custom event for auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">DealBasket</div>
        <ul className="navbar__links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <div className="navbar__auth">
          {isLoggedIn ? (
            <button className="profile-btn" onClick={() => setShowDrawer(true)}>
              👤 Profile
            </button>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
