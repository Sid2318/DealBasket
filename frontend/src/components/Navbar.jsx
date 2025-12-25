import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">MyLogo</div>
      <ul className="navbar__links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
      <div className="navbar__toggle">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
