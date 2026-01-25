import express from "express";
import {
  savePurchase,
  getMyHistory,
  getTotalSavings,
} from "../controllers/myHistoryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Save purchase (protected)
router.post("/save", protect, savePurchase);

// Get user's purchase history (protected)
router.get("/", protect, getMyHistory);

// Get total savings (protected)
router.get("/total-savings", protect, getTotalSavings);

export default router;
