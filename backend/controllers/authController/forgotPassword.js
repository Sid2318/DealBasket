import { sendPasswordResetToken } from "../../services/authService.js";
import { storePasswordResetToken } from "../../services/otpService.js";
import logger from "../../utils/logger.js";

// Send password reset token via email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  logger.info("Password reset request initiated", {
    email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    // Generate and send reset token
    const resetData = await sendPasswordResetToken(email);
    await storePasswordResetToken(
      email,
      resetData.resetToken,
      resetData.userId,
    );

    logger.info("Password reset token sent successfully", { email });
    res.status(200).json({
      message: "Password reset code sent to your email",
      email,
    });
  } catch (error) {
    logger.error("Forgot password error:", { error: error.message });

    if (error.message === "User not found") {
      return res
        .status(404)
        .json({ message: "No account found with this email address" });
    }

    res.status(500).json({ message: "Failed to send password reset code" });
  }
};
