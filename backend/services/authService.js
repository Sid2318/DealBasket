import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "../utils/logger.js";

// Generate JWT Access Token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m", // 15 minutes default
  });
};

// Generate JWT Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "3d", // 3 days default
  });
};

// Generate secure random token
const generateSecureToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const signupUser = async (userData) => {
  const { name, email, password } = userData;

  logger.info("🔐 Starting user registration process", { email, name });

  // Check if user exists
  logger.debug("🔍 Checking if user already exists", { email });
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn("⚠️ User registration failed - user already exists", { email });
    throw new Error("User already exists");
  }

  logger.debug("✅ User email is available", { email });
  logger.debug("🔒 Hashing user password");
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for security

  logger.info("💾 Creating new user account", { email, name });
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  logger.info("🎉 User registration completed successfully", {
    email,
    name,
    userId: user._id,
  });
  return { message: "User registered successfully" };
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  logger.info("🔑 Starting user authentication process", { email });

  // Find user
  logger.debug("🔍 Looking up user by email", { email });
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("❌ Authentication failed - user not found", { email });
    throw new Error("Invalid credentials");
  }

  logger.debug("✅ User found, verifying password", {
    email,
    userId: user._id,
  });

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn("❌ Authentication failed - invalid password", {
      email,
      userId: user._id,
    });
    throw new Error("Invalid credentials");
  }

  logger.debug("🔐 Password verified, generating tokens", {
    email,
    userId: user._id,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  logger.debug("💾 Storing refresh token in database", {
    email,
    userId: user._id,
  });

  // Store refresh token in database
  await user.addRefreshToken(refreshToken);

  logger.info("🎉 User authentication completed successfully", {
    email,
    userId: user._id,
    name: user.name,
    role: user.role,
  });

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Refresh access token using refresh token
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists in database
    const user = await User.findOne({
      _id: decoded.id,
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    return {
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Logout user and invalidate refresh token
export const logoutUser = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and remove refresh token
    const user = await User.findById(decoded.id);
    if (user) {
      await user.removeRefreshToken(refreshToken);
    }

    return { message: "Logout successful" };
  } catch (error) {
    // Even if token is invalid, we consider logout successful
    return { message: "Logout successful" };
  }
};

// Logout from all devices
export const logoutAllDevices = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and clear all refresh tokens
    const user = await User.findById(decoded.id);
    if (user) {
      await user.clearAllRefreshTokens();
    }

    return { message: "Logged out from all devices successfully" };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

/* 
=== AUTH SERVICE FUNCTIONS OVERVIEW ===

1. generateAccessToken(userId)
   - Creates JWT access token with short expiration (15m)
   - Uses JWT_ACCESS_SECRET for signing
   - Returns signed JWT string

2. generateRefreshToken(userId) 
   - Creates JWT refresh token with long expiration (30d)
   - Uses JWT_REFRESH_SECRET for signing
   - Returns signed JWT string

3. generateSecureToken()
   - Generates cryptographically secure random token
   - Uses crypto.randomBytes() for security
   - Returns hex-encoded random string

4. signupUser(userData)
   - Handles user registration process
   - Checks if user already exists
   - Hashes password with bcrypt
   - Creates new user in database
   - Returns success message

5. loginUser(credentials)
   - Handles user authentication
   - Finds user by email
   - Compares password with bcrypt
   - Generates access & refresh tokens
   - Stores refresh token in database
   - Returns tokens and user data

6. refreshAccessToken(refreshToken)
   - Validates and refreshes access tokens
   - Verifies refresh token signature
   - Checks token exists in database
   - Generates new access token
   - Returns new access token and user data

7. logoutUser(refreshToken)
   - Logs out user from single device
   - Removes specific refresh token from database
   - Invalidates current session only

8. logoutAllDevices(refreshToken)
   - Logs out user from all devices
   - Verifies refresh token to get user ID
   - Removes all refresh tokens for user
   - Invalidates all user sessions

9. verifyAccessToken(token)
   - Verifies JWT access token signature
   - Uses JWT_ACCESS_SECRET for verification
   - Returns decoded token payload or throws error
*/
