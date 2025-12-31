import express from "express";
import {
  savePurchase,
  getMyHistory,
  getTotalSavings,
} from "../controllers/myHistoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Save purchase (unprotected for guest users)
router.post("/purchase", savePurchase);
router.post("/save", savePurchase);

// Get user's purchase history (unprotected for guest users)
router.get("/", getMyHistory);

// Get total savings (unprotected for guest users)
router.get("/total-savings", getTotalSavings);

export default router;
