import express from "express";
import {
  signup,
  sendOtp,
  verifyOtpAndRegister,
  resendOtpHandler,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authLimiter from "../middlewares/authLimiter.js";

const router = express.Router();

// Public routes - OTP based registration
router.post("/send-otp", authLimiter, sendOtp); // Step 1: Send OTP
router.post("/verify-otp", authLimiter, verifyOtpAndRegister); // Step 2: Verify OTP & Register
router.post("/resend-otp", authLimiter, resendOtpHandler); // Resend OTP

// Legacy signup route (redirects to OTP flow)
router.post("/signup", authLimiter, signup);

// Login
router.post("/login", authLimiter, login);
router.post("/refresh", refreshToken); // No rate limiting for token refresh

// Protected routes (require authentication)
router.post("/logout", logout); // Can logout without valid token
router.post("/logout-all", logoutAll);
router.get("/me", protect, getMe);

export default router;

// API Endpoints Overview:
// POST /auth/send-otp - Step 1: Send OTP to email for registration
// POST /auth/verify-otp - Step 2: Verify OTP and complete registration
// POST /auth/resend-otp - Resend OTP for pending registration
// POST /auth/signup - Legacy route (redirects to send-otp)
// POST /auth/login - Login user (sets HTTP-only cookie)
// POST /auth/refresh - Refresh access token using cookie
// POST /auth/logout - Logout user (clears cookie)
// POST /auth/logout-all - Logout from all devices
// GET /auth/me - Get current user info (protected)
