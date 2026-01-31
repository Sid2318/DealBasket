import nodemailer from "nodemailer";
import crypto from "crypto";
import logger from "../utils/logger.js";

// In-memory store for pending registrations with OTP
// Key: email, Value: { userData, otp, expiresAt }
const pendingRegistrations = new Map();

// OTP expiration time (5 minutes)
const OTP_EXPIRY_MS = 5 * 60 * 1000;

// Cleanup expired entries every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [email, data] of pendingRegistrations.entries()) {
      if (now > data.expiresAt) {
        pendingRegistrations.delete(email);
        logger.debug("🧹 Cleaned up expired pending registration", { email });
      }
    }
  },
  10 * 60 * 1000,
);

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP via email
export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "DealBasket - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering with DealBasket!</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message from DealBasket.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  logger.info("📧 OTP email sent successfully", { email });
};

// Store pending registration with OTP
export const storePendingRegistration = async (userData) => {
  const { email } = userData;
  const otp = generateOTP();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  // Store in memory
  pendingRegistrations.set(email, {
    userData,
    otp,
    expiresAt,
  });

  logger.info("📝 Pending registration stored", { email });

  // Send OTP via email
  await sendOTPEmail(email, otp);

  return { otp }; // Return for testing purposes (remove in production)
};

// Verify OTP and return user data if valid
export const verifyOTP = (email, otp) => {
  const pendingData = pendingRegistrations.get(email);

  if (!pendingData) {
    logger.warn("❌ No pending registration found", { email });
    throw new Error("No pending registration found. Please register again.");
  }

  if (Date.now() > pendingData.expiresAt) {
    pendingRegistrations.delete(email);
    logger.warn("❌ OTP expired", { email });
    throw new Error("OTP has expired. Please register again.");
  }

  if (pendingData.otp !== otp) {
    logger.warn("❌ Invalid OTP", { email });
    throw new Error("Invalid OTP. Please try again.");
  }

  // OTP verified - get user data and clean up
  const { userData } = pendingData;
  pendingRegistrations.delete(email);

  logger.info("✅ OTP verified successfully", { email });
  return userData;
};

// Check if there's a pending registration
export const hasPendingRegistration = (email) => {
  const pendingData = pendingRegistrations.get(email);
  if (!pendingData) return false;

  // Check if expired
  if (Date.now() > pendingData.expiresAt) {
    pendingRegistrations.delete(email);
    return false;
  }

  return true;
};

// Resend OTP for pending registration
export const resendOTP = async (email) => {
  const pendingData = pendingRegistrations.get(email);

  if (!pendingData) {
    throw new Error("No pending registration found. Please register again.");
  }

  // Generate new OTP and update expiry
  const otp = generateOTP();
  pendingData.otp = otp;
  pendingData.expiresAt = Date.now() + OTP_EXPIRY_MS;

  // Send new OTP
  await sendOTPEmail(email, otp);

  logger.info("🔄 OTP resent", { email });
  return { message: "OTP resent successfully" };
};
