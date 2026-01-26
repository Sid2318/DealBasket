import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authLimiter from "../middlewares/authLimiter.js";

const router = express.Router();

// Public routes
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshToken); // No rate limiting for token refresh

// Protected routes (require authentication)
router.post("/logout", logout); // Can logout without valid token
router.post("/logout-all", logoutAll);
router.get("/me", protect, getMe);

export default router;

// 🚀 API Endpoints Overview:
// POST /auth/signup - Register new user
// POST /auth/login - Login user (sets HTTP-only cookie)
// POST /auth/refresh - Refresh access token using cookie
// POST /auth/logout - Logout user (clears cookie)
// POST /auth/logout-all - Logout from all devices
// GET /auth/me - Get current user info (protected)
