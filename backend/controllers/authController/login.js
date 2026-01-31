import {
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
} from "../../services/authService.js";
import logger from "../../utils/logger.js";

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

export const login = async (req, res) => {
  const { email } = req.body;
  logger.info("Login attempt initiated", {
    email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    logger.debug("Validating login credentials", { email });
    const validationErrors = validateLogin(req.body);
    if (validationErrors.length > 0) {
      logger.warn("Login validation failed", {
        email,
        errors: validationErrors,
      });
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    logger.info("Login validation passed", { email });
    logger.info("Authenticating user credentials", { email });
    const result = await loginUser(req.body);

    logger.debug("Setting refresh token cookie", {
      email,
      userId: result.user?.id,
    });
    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    // Remove refresh token from response body for security
    const { refreshToken, ...responseData } = result;

    logger.info("Login successful", {
      email,
      userId: result.user?.id,
      name: result.user?.name,
    });
    res.json(responseData);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      logger.warn("Login failed - invalid credentials", { email });
      return res.status(401).json({ message: "Invalid email or password" });
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
  logger.info("Token refresh attempt initiated", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    const refreshToken = req.cookies.refreshToken;
    logger.debug("Checking refresh token in cookies");

    if (!refreshToken) {
      logger.warn("Token refresh failed - no refresh token in cookies");
      return res.status(401).json({
        message: "No refresh token found. Please login again.",
      });
    }

    logger.debug("Refresh token found, processing...");
    const result = await refreshAccessToken(refreshToken);

    logger.info("Token refreshed successfully", {
      userId: result.user.id,
      email: result.user.email,
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
      return res.status(401).json({ message: "No refresh token found" });
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
