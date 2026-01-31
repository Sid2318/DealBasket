import { resetPassword } from "../../services/authService.js";
import {
  verifyPasswordResetToken,
  resendPasswordResetToken,
} from "../../services/otpService.js";
import logger from "../../utils/logger.js";

// Validation for password reset
const validatePasswordReset = (data) => {
  const { password, confirmPassword } = data;
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!confirmPassword) {
    errors.push("Confirm password is required");
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
};

// Verify reset token and reset password
export const resetPasswordHandler = async (req, res) => {
  const { email, resetToken, password, confirmPassword } = req.body;
  logger.info("Password reset attempt", {
    email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    if (!email || !resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Email, reset token, and passwords are required",
      });
    }

    // Validate password
    const validationErrors = validatePasswordReset({
      password,
      confirmPassword,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Verify reset token
    const tokenVerification = verifyPasswordResetToken(email, resetToken);

    if (!tokenVerification.success) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    logger.info("Reset token verified, updating password", { email });

    // Reset password
    const result = await resetPassword(email, password);

    logger.info("Password reset completed successfully", { email });
    res.status(200).json({
      message: result.message,
      success: true,
    });
  } catch (error) {
    logger.error("Password reset error:", { error: error.message });

    if (
      error.message.includes("No password reset request") ||
      error.message.includes("Reset token has expired") ||
      error.message.includes("Invalid reset token")
    ) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(500).json({ message: "Password reset failed" });
  }
};

// Resend password reset token
export const resendPasswordResetHandler = async (req, res) => {
  const { email } = req.body;
  logger.info("Resend password reset token request", { email });

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await resendPasswordResetToken(email);

    logger.info("Password reset token resent successfully", { email });
    res
      .status(200)
      .json({ message: "Password reset code resent successfully" });
  } catch (error) {
    logger.error("Resend password reset token error:", {
      error: error.message,
    });
    res.status(500).json({ message: "Failed to resend password reset code" });
  }
};
