import express from "express";
import {
  savePurchase,
  getMyHistory,
  getTotalSavings,
} from "../controllers/myHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Save purchase (protected route)
router.post("/save", authMiddleware, savePurchase);

// Get user's purchase history (protected route)
router.get("/", authMiddleware, getMyHistory);

// Get total savings (protected route)
router.get("/total-savings", authMiddleware, getTotalSavings);

export default router;
