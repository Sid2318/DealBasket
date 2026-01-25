import express from "express";
import {
  savePurchase,
  getMyHistory,
  getTotalSavings,
} from "../controllers/myHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Save purchase (protected)
router.post(
  "/purchase",
  authMiddleware,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  validateRequest,
  savePurchase,
);
router.post(
  "/save",
  authMiddleware,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  validateRequest,
  savePurchase,
);

// Get user's purchase history (protected)
router.get("/", authMiddleware, getMyHistory);

// Get total savings (protected)
router.get("/total-savings", authMiddleware, getTotalSavings);

export default router;
