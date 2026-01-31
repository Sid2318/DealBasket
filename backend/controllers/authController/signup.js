import {
  checkUserExists,
  createVerifiedUser,
  signupUser,
} from "../../services/authService.js";
import {
  storePendingRegistration,
  verifyOTP,
  resendOTP,
  hasPendingRegistration,
} from "../../services/otpService.js";
import logger from "../../utils/logger.js";

const validateSignup = (data) => {
  const { name, email, password } = data;
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return errors;
};

// Configure cookie options
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  };
};

// Step 1: Send OTP to email for registration
export const sendOtp = async (req, res) => {
  const { email, name } = req.body;
  logger.info("OTP request initiated for registration", {
    email,
    name,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    // Validate signup data
    logger.debug("Validating signup data", { email });
    const validationErrors = validateSignup(req.body);
    if (validationErrors.length > 0) {
      logger.warn("OTP request validation failed", {
        email,
        errors: validationErrors,
      });
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check if user already exists in DB
    const userExists = await checkUserExists(email);
    if (userExists) {
      logger.warn("OTP request failed - user already exists", { email });
      return res.status(400).json({ message: "User already exists" });
    }

    logger.info("Validation passed, storing pending registration", { email });

    // Store pending registration and send OTP
    await storePendingRegistration(req.body);

    logger.info("OTP sent successfully", { email });
    res.status(200).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    logger.error("Send OTP error:", { error: error.message });
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Step 2: Verify OTP and complete registration
export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;
  logger.info("OTP verification attempt", {
    email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP and get user data
    const userData = verifyOTP(email, otp);

    logger.info("OTP verified, creating user account", { email });

    // Create verified user and generate tokens
    const result = await createVerifiedUser(userData);

    // Set refresh token in cookie
    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    // Remove refresh token from response body
    const { refreshToken, ...responseData } = result;

    logger.info("User registered successfully after OTP verification", {
      email,
      userId: result.user?.id,
    });

    res.status(201).json(responseData);
  } catch (error) {
    logger.error("OTP verification error:", { error: error.message });

    if (
      error.message.includes("No pending registration") ||
      error.message.includes("OTP has expired") ||
      error.message.includes("Invalid OTP")
    ) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "User already exists") {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

// Resend OTP for pending registration
export const resendOtpHandler = async (req, res) => {
  const { email } = req.body;
  logger.info("Resend OTP request", { email });

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!hasPendingRegistration(email)) {
      return res.status(400).json({
        message:
          "No pending registration found. Please start the registration process again.",
      });
    }

    await resendOTP(email);

    logger.info("OTP resent successfully", { email });
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    logger.error("Resend OTP error:", { error: error.message });
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// Legacy signup - redirects to OTP flow
export const signup = async (req, res) => {
  return sendOtp(req, res);
};
