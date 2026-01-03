import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token);

      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsSeller(userData.role === "seller");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
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
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    // Dispatch custom event for auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo" onClick={() => navigate("/")}>
          <img
            src="/images/DealBasketLogo.png"
            alt="DealBasket"
            className="logo-image"
          />
          <span>DealBasket</span>
        </div>
        <ul className="navbar__links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to="/history">My Savings</Link>
              </li>
              {isSeller && (
                <>
                  <li>
                    <Link to="/seller/products">My Products</Link>
                  </li>
                  <li>
                    <Link to="/seller/stats">Seller Stats</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
        <div className="navbar__auth">
          {isLoggedIn ? (
            <button className="profile-btn" onClick={() => setShowDrawer(true)}>
              <div className="profile-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="profile-text">Profile</span>
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
