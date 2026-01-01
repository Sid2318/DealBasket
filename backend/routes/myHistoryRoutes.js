import express from "express";
import {
  savePurchase,
  getMyHistory,
  getTotalSavings,
} from "../controllers/myHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Save purchase (unprotected for guest users)
router.post("/purchase", authMiddleware, savePurchase);
router.post("/save", authMiddleware, savePurchase);

// Get user's purchase history (protected)
router.get("/", authMiddleware, getMyHistory);

// Get total savings (protected)
router.get("/total-savings", authMiddleware, getTotalSavings);

export default router;
