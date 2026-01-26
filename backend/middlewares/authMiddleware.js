import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { verifyAccessToken } from "../services/authService.js";

// Protect routes (JWT authentication using access token)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get access token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify access token using dedicated secret
      const decoded = verifyAccessToken(token);

      // Get user from the token (exclude password and refresh tokens)
      req.user = await User.findById(decoded.id).select(
        "-password -refreshTokens",
      );

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      logger.error("Access token verification failed:", {
        error: error.message,
        token: token ? `${token.substring(0, 10)}...` : "no token",
      });

      if (
        error.message === "Invalid access token" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({
          message: "Access token expired or invalid",
          code: "TOKEN_EXPIRED",
        });
      }

      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// Middleware to check if user has specific role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't block if no token)
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select(
        "-password -refreshTokens",
      );
    } catch (error) {
      // Silently fail for optional auth
      req.user = null;
    }
  }

  next();
};

// Export as named export for backward compatibility
export const authMiddleware = protect;

// 🔐 Enhanced Security Flow:
// 1️⃣ Extract access token from Authorization header
// 2️⃣ Verify token using dedicated ACCESS_SECRET
// 3️⃣ Check if user still exists in database
// 4️⃣ Exclude sensitive data (password, refresh tokens)
// 5️⃣ Provide clear error messages for token expiry
// 6️⃣ Support role-based authorization
// 7️⃣ Optional authentication for public endpoints

/* 
=== AUTH MIDDLEWARE FUNCTIONS OVERVIEW ===

1. protect(req, res, next)
   - Main authentication middleware for protected routes
   - Extracts JWT token from Authorization header (Bearer token)
   - Verifies access token using verifyAccessToken() service
   - Fetches user from database and attaches to req.user
   - Excludes sensitive fields (password, refreshTokens)
   - Returns 401 if no token or invalid token
   - Calls next() if authentication successful

2. authorize(...roles)
   - Role-based authorization middleware
   - Returns middleware function that checks user role
   - Takes array of allowed roles as parameter
   - Must be used after protect() middleware
   - Returns 403 if user role not in allowed roles
   - Calls next() if user has required role

3. optional(req, res, next)
   - Optional authentication middleware
   - Attempts to authenticate user if token present
   - Does not block request if no token or invalid token
   - Sets req.user if valid token found, null otherwise
   - Always calls next() - never blocks request
   - Useful for endpoints that work with or without auth

Usage Examples:
- Protected route: protect, authorize(['admin', 'seller'])
- Optional auth: optional
- Required auth: protect
- Admin only: protect, authorize(['admin'])
*/
