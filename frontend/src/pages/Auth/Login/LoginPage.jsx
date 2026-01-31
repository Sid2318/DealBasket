import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { useAuth } from "../../../hooks/useAuth";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Login successful, navigate to home
        navigate("/");
      } else {
        // Login failed, show error
        setError(result.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p className="subtitle">Login to continue to DealBasket</p>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            {formErrors.email && (
              <ErrorMessage>{formErrors.email}</ErrorMessage>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {formErrors.password && (
              <ErrorMessage>{formErrors.password}</ErrorMessage>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="forgot-password">
            <span onClick={() => navigate("/forgot-password")} className="link">
              Forgot Password?
            </span>
          </div>
        </form>

        <div className="switch-page">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="link">
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
