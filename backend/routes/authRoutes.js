import express from "express";
import { signup, login } from "../controllers/authController.js";
import authLimiter from "../middlewares/authLimiter.js";

const router = express.Router();

// Signup route
router.post("/signup", authLimiter, signup);

// Login route
router.post("/login", authLimiter, login);

export default router;
