import express from "express";
import { signup, login } from "../controllers/authController.js";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Signup route validation
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  validateRequest,
  signup,
);

// Login route validation
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login,
);

export default router;
