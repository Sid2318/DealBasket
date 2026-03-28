import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPasswordPage.scss";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { resetPassword, resendResetToken } from "../../../api/authApi";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    resetToken: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from navigation state (from ForgotPasswordPage)
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (error) setError("");
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTokenChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, resetToken: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.resetToken) {
      errors.resetToken = "Reset code is required";
    } else if (formData.resetToken.length !== 6) {
      errors.resetToken = "Reset code must be 6 digits";
    }

    if (!formData.password) {
      errors.password = "New password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setError("");

      await resetPassword(
        formData.email,
        formData.resetToken,
        formData.password,
        formData.confirmPassword,
      );

      setSuccess(true);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Password reset failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resendResetToken(formData.email);
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

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Password Reset Successful!</h2>
            <p>Your password has been updated successfully.</p>
            <p>You can now sign in with your new password.</p>
            <button className="login-btn" onClick={handleBackToLogin}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <button
            className="back-btn"
            onClick={() => navigate("/forgot-password")}
          >
            ← Back
          </button>
          <h2>Reset Password</h2>
          <p className="subtitle">
            Enter the reset code sent to your email and create a new password
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form className="auth-form" onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            {formErrors.email && (
              <ErrorMessage>{formErrors.email}</ErrorMessage>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="resetToken">Reset Code</label>
            <input
              id="resetToken"
              type="text"
              name="resetToken"
              placeholder="Enter 6-digit reset code"
              value={formData.resetToken}
              onChange={handleTokenChange}
              disabled={loading}
              maxLength={6}
              className="token-input"
            />
            {formErrors.resetToken && (
              <ErrorMessage>{formErrors.resetToken}</ErrorMessage>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            {formErrors.password && (
              <ErrorMessage>{formErrors.password}</ErrorMessage>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
            />
            {formErrors.confirmPassword && (
              <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              !formData.resetToken ||
              formData.resetToken.length !== 6
            }
          >
            {loading ? (
              <span className="btn-loader">
                <span className="btn-spinner" aria-hidden="true"></span>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              className={`resend-btn ${resendDisabled ? "disabled" : ""}`}
              onClick={handleResendToken}
              disabled={resendDisabled || loading}
            >
              {resendDisabled ? `Resend in ${resendCountdown}s` : "Resend Code"}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Remember your password?{" "}
          <span onClick={handleBackToLogin} className="link">
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
