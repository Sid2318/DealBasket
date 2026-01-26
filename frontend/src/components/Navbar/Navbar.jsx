import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const isSeller = user?.role === "seller";

  const handleLogout = async () => {
    await logout();
    setShowDrawer(false);
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
