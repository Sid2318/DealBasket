import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.scss";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import {
  sendOtp,
  verifyOtp,
  resendOtp,
  setAccessToken,
} from "../../../api/authApi";
import { useAuth } from "../../../hooks/useAuth";

const SignUpPage = () => {
  const { checkAuthStatus } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP Verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (error) setError("");
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { name, email, password } = formData;

    try {
      setLoading(true);
      setError("");

      await sendOtp({ name, email, password });

      // Move to OTP verification step
      setStep(2);
      startResendCooldown();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await verifyOtp(formData.email, otp);

      // Store access token
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }

      setSuccess(true);

      // Update auth state and redirect to home immediately
      await checkAuthStatus();
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await resendOtp(formData.email);
      startResendCooldown();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Start cooldown for resend button
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

  // Go back to form
  const handleBackToForm = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>{step === 1 ? "Create Account" : "Verify Email"}</h2>
        <p className="subtitle">
          {step === 1
            ? "Join DealBasket today!"
            : `Enter the OTP sent to ${formData.email}`}
        </p>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <div className="success-message">
            Account created successfully! Redirecting...
          </div>
        )}

        {step === 1 ? (
          // Step 1: Registration Form
          <form className="signup-form" onSubmit={handleSendOtp}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.name && (
                <ErrorMessage>{formErrors.name}</ErrorMessage>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.password && (
                <ErrorMessage>{formErrors.password}</ErrorMessage>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.confirmPassword && (
                <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification
          <form className="signup-form" onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={loading || success}
                maxLength={6}
                className="otp-input"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || success || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
              >
                {resendDisabled
                  ? `Resend OTP in ${resendCountdown}s`
                  : "Resend OTP"}
              </button>
              <button
                type="button"
                className="back-btn"
                onClick={handleBackToForm}
                disabled={loading}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <div className="switch-page">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
