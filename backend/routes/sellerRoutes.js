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
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Seller registration and profile
router.post(
  "/register",
  protect,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty.isEmail().withMessage("Valid email is required"),
    body("shopName").notEmpty().withMessage("Shop name is required"),
  ],
  validateRequest,
  registerSeller,
);
router.get("/profile", protect, getSellerProfile);
router.put(
  "/profile",
  protect,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("shopName")
      .optional()
      .notEmpty()
      .withMessage("Shop name cannot be empty"),
  ],
  validateRequest,
  updateSellerProfile,
);

// Product management
router.post(
  "/products",
  protect,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validateRequest,
  addProduct,
);
router.get("/products", protect, getSellerProducts);
router.put(
  "/products/:productId",
  protect,
  [
    param("productId").isMongoId().withMessage("Valid product ID required"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Product name cannot be empty"),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Category cannot be empty"),
  ],
  validateRequest,
  updateProduct,
);
router.delete(
  "/products/:productId",
  protect,
  [param("productId").isMongoId().withMessage("Valid product ID required")],
  validateRequest,
  deleteProduct,
);

// Seller stats
router.get("/stats", protect, getSellerStats);
router.get("/sales-stats", protect, getSellerSalesStats);

export default router;
