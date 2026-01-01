import express from "express";
import {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getSellerStats,
  getSellerSalesStats,
} from "../controllers/sellerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Seller registration and profile
router.post("/register", protect, registerSeller);
router.get("/profile", protect, getSellerProfile);
router.put("/profile", protect, updateSellerProfile);

// Product management
router.post("/products", protect, addProduct);
router.get("/products", protect, getSellerProducts);
router.put("/products/:productId", protect, updateProduct);
router.delete("/products/:productId", protect, deleteProduct);

// Seller stats
router.get("/stats", protect, getSellerStats);
router.get("/sales-stats", protect, getSellerSalesStats);

export default router;
