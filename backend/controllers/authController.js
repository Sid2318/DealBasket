import {
  signupUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
} from "../services/authService.js";
import logger from "../utils/logger.js";

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

const validateLogin = (data) => {
  const { email, password } = data;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
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

export const signup = async (req, res) => {
  try {
    const validationErrors = validateSignup(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    logger.error("Signup error:", { error: error.message });
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const validationErrors = validateLogin(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    logger.info("Login attempt for email:", { email: req.body.email });
    const result = await loginUser(req.body);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    // Remove refresh token from response body for security
    const { refreshToken, ...responseData } = result;

    logger.info("Login successful for user:", { email: req.body.email });
    res.json(responseData);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    logger.error("Login error:", {
      error: error.message,
      email: req.body.email,
    });
    res.status(500).json({ message: "Login failed" });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const result = await refreshAccessToken(refreshToken);
    logger.info("Token refreshed successfully for user:", {
      userId: result.user.id,
    });

    res.json(result);
  } catch (error) {
    logger.error("Token refresh error:", { error: error.message });
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    logger.info("User logged out successfully");
    res.json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Logout error:", { error: error.message });
    res.status(500).json({ message: "Logout failed" });
  }
};

// Logout from all devices
export const logoutAll = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    await logoutAllDevices(refreshToken);

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    logger.info("User logged out from all devices successfully");
    res.json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    logger.error("Logout all devices error:", { error: error.message });
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Get current user info
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Get user info error:", { error: error.message });
    res.status(500).json({ message: "Failed to get user info" });
  }
};

/* 
=== AUTH CONTROLLER FUNCTIONS OVERVIEW ===

1. getCookieOptions()
   - Configures secure HTTP-only cookie settings for refresh tokens
   - Sets secure flag for production, SameSite protection
   - Returns cookie configuration object

2. signup(req, res)
   - Handles user registration requests
   - Validates input data using validateSignup()
   - Calls signupUser() service to create new user
   - Returns success message or validation/server errors

3. login(req, res)
   - Handles user authentication requests
   - Validates credentials using validateLogin()
   - Calls loginUser() service to authenticate
   - Sets refresh token in HTTP-only cookie
   - Returns access token and user data (excludes refresh token)

4. refreshToken(req, res)
   - Refreshes expired access tokens
   - Extracts refresh token from HTTP-only cookie
   - Calls refreshAccessToken() service to generate new access token
   - Returns new access token and user data

5. logout(req, res)
   - Handles single device logout
   - Calls logoutUser() service to invalidate refresh token
   - Clears refresh token cookie
   - Returns success message

6. logoutAll(req, res)
   - Handles logout from all devices
   - Calls logoutAllDevices() service to invalidate all user tokens
   - Clears refresh token cookie
   - Returns success message

7. getMe(req, res)
   - Returns current authenticated user information
   - Uses user data from req.user (set by auth middleware)
   - Returns filtered user data (id, name, email, role)
*/
