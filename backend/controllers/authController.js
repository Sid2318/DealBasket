import {
  signupUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  checkUserExists,
  createVerifiedUser,
} from "../services/authService.js";
import {
  storePendingRegistration,
  verifyOTP,
  resendOTP,
  hasPendingRegistration,
} from "../services/otpService.js";
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
      logger.warn("Signup validation failed", {
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
      logger.warn("User already exists", { email });
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
      return res.status(400).json({ message: error.message });
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
        message: "No pending registration found. Please register again.",
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
  logger.info("Token refresh attempt initiated", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    const refreshToken = req.cookies.refreshToken;
    logger.debug("Checking refresh token in cookies");

    if (!refreshToken) {
      logger.warn("Refresh token not found in cookies", {
        ip: req.ip,
      });
      return res.status(401).json({ message: "Refresh token not found" });
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

1. sendOtp(req, res)
   - Step 1 of OTP-based registration
   - Validates user data (name, email, password)
   - Checks if user already exists in database
   - Stores pending registration in memory with generated OTP
   - Sends OTP to user's email via nodemailer
   - Returns success message with email confirmation

2. verifyOtpAndRegister(req, res)
   - Step 2 of OTP-based registration
   - Validates OTP against stored data in memory
   - Creates verified user in database with isVerified: true
   - Generates access and refresh tokens
   - Sets refresh token in HTTP-only cookie
   - Returns access token and user data for immediate login

3. resendOtpHandler(req, res)
   - Resends OTP for pending registration
   - Checks if pending registration exists in memory
   - Generates new OTP and updates expiry time
   - Sends new OTP to user's email
   - Returns success message

4. signup(req, res)
   - Legacy endpoint that redirects to sendOtp
   - Maintains backward compatibility
   - Automatically initiates OTP flow

5. getCookieOptions()
   - Configures secure HTTP-only cookie settings for refresh tokens
   - Sets secure flag for production, SameSite protection
   - Returns cookie configuration object

6. login(req, res)
   - Handles user authentication requests
   - Validates credentials using validateLogin()
   - Calls loginUser() service to authenticate
   - Sets refresh token in HTTP-only cookie
   - Returns access token and user data (excludes refresh token)

7. refreshToken(req, res)
   - Refreshes expired access tokens
   - Extracts refresh token from HTTP-only cookie
   - Calls refreshAccessToken() service to generate new access token
   - Returns new access token and user data

8. logout(req, res)
   - Handles single device logout
   - Calls logoutUser() service to invalidate refresh token
   - Clears refresh token cookie
   - Returns success message

9. logoutAll(req, res)
   - Handles logout from all devices
   - Calls logoutAllDevices() service to invalidate all user tokens
   - Clears refresh token cookie
   - Returns success message

10. getMe(req, res)
    - Returns current authenticated user information
    - Uses user data from req.user (set by auth middleware)
    - Returns filtered user data (id, name, email, role)

=== OTP REGISTRATION FLOW ===

Frontend Flow:
1. User fills registration form (name, email, password)
2. Frontend calls POST /auth/send-otp
3. User receives OTP email and enters OTP
4. Frontend calls POST /auth/verify-otp
5. User is automatically logged in and redirected

Backend Flow:
1. sendOtp() receives registration data
   ├── Validates input (name, email, password >= 8 chars)
   ├── Checks if email already exists in User collection
   ├── Calls storePendingRegistration() in otpService
   │   ├── Generates 6-digit OTP
   │   ├── Stores {userData, otp, expiresAt} in memory Map
   │   └── Sends OTP email via nodemailer
   └── Returns success message to frontend

2. verifyOtpAndRegister() receives email + OTP
   ├── Calls verifyOTP() in otpService
   │   ├── Checks if pending registration exists
   │   ├── Validates OTP hasn't expired (5 min limit)
   │   ├── Compares provided OTP with stored OTP
   │   └── Returns userData if valid, throws error if invalid
   ├── Calls createVerifiedUser() in authService
   │   ├── Creates User with isVerified: true
   │   ├── Generates JWT access token (15m expiry)
   │   ├── Generates JWT refresh token (30d expiry)
   │   └── Stores refresh token in user document
   ├── Sets refresh token in HTTP-only cookie
   └── Returns access token + user data for immediate login

3. resendOtpHandler() for OTP resend
   ├── Checks if pending registration exists
   ├── Generates new OTP and updates expiry
   ├── Sends new OTP email
   └── Returns success message

=== MEMORY MANAGEMENT ===

- Pending registrations stored in Map with email as key
- OTP expires after 5 minutes
- Automatic cleanup every 10 minutes removes expired entries
- No OTP persistence in database for security
- Only isVerified field stored permanently in User model

=== SECURITY FEATURES ===

- OTP valid for 5 minutes only
- No OTP storage in database
- Automatic cleanup of expired registrations
- HTTP-only cookies for refresh tokens
- JWT tokens with appropriate expiry times
- Email validation and password strength requirements
- Rate limiting on OTP endpoints via authLimiter middleware
*/
