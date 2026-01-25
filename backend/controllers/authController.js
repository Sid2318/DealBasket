import { signupUser, loginUser } from "../services/authService.js";
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

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
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
    logger.info("Login successful for user:", { email: req.body.email });
    res.json(result);
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

// 🔐 Signup Workflow (Short Steps)
// 1️⃣ Frontend sends name, email, password
// 2️⃣ Backend checks if email already exists
// 3️⃣ If exists → error
// 4️⃣ Hash password using bcrypt
// 5️⃣ Save user in MongoDB
// 6️⃣ Send success response

// 🔓 Login Workflow (Short Steps)
// 1️⃣ Frontend sends email & password
// 2️⃣ Backend finds user in MongoDB
// 3️⃣ If not found → error
// 4️⃣ Compare password using bcrypt
// 5️⃣ If match → create JWT token
// 6️⃣ Send token to frontend

// 🔁 After Login (Very Important)
// 7️⃣ Frontend stores JWT
// 8️⃣ Frontend sends JWT in Authorization header for protected APIs
// 9️⃣ Backend verifies JWT and allows access
