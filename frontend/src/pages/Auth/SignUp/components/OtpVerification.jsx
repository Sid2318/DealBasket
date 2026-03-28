import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../SignUpPage.scss";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import { verifyOtp, resendOtp, setAccessToken } from "../../../../api/authApi";
import { useAuth } from "../../../../hooks/useAuth";

const OtpVerification = ({ formData, onBackToForm }) => {
  const { checkAuthStatus } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  // Start resend countdown when component mounts
  useEffect(() => {
    startResendCooldown();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (error) setError("");
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
    setOtp("");
    setError("");
    onBackToForm();
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Verify Email</h2>
        <p className="subtitle">Enter the OTP sent to {formData.email}</p>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <div className="success-message">
            Account created successfully! Redirecting...
          </div>
        )}

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
            {loading ? (
              <span className="btn-loader">
                <span className="btn-spinner" aria-hidden="true"></span>
                Verifying...
              </span>
            ) : (
              "Verify & Create Account"
            )}
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

export default OtpVerification;
