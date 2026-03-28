import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.scss";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { forgotPassword, resendResetToken } from "../../../api/authApi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSendResetToken = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);
      setSuccess(true);
      startResendCooldown();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    try {
      setLoading(true);
      setError("");

      await resendResetToken(email);
      startResendCooldown();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to resend reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendDisabled(true);
    setResendCountdown(60);

    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleContinueToReset = () => {
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-btn" onClick={() => navigate("/login")}>
            ← Back to Login
          </button>
          <h2>{success ? "Check Your Email" : "Forgot Password"}</h2>
          <p className="subtitle">
            {success
              ? `We've sent a reset code to ${email}`
              : "Enter your email to receive a password reset code"}
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!success ? (
          <form className="auth-form" onSubmit={handleSendResetToken}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader">
                  <span className="btn-spinner" aria-hidden="true"></span>
                  Sending...
                </span>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        ) : (
          <div className="success-section">
            <div className="success-message">
              <div className="success-icon">📧</div>
              <p>Reset code sent successfully!</p>
            </div>

            <div className="action-buttons">
              <button className="primary-btn" onClick={handleContinueToReset}>
                Enter Reset Code
              </button>

              <button
                className={`secondary-btn ${resendDisabled ? "disabled" : ""}`}
                onClick={handleResendToken}
                disabled={resendDisabled || loading}
              >
                {resendDisabled
                  ? `Resend in ${resendCountdown}s`
                  : "Resend Code"}
              </button>
            </div>
          </div>
        )}

        <div className="auth-footer">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")} className="link">
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
