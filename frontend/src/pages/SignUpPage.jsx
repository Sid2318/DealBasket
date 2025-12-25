import React from "react";
import "./SignUpPage.scss";

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form className="signup-form">
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignUpPage;
