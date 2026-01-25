import express from "express";
import {
  getSellerShop,
  getAllProducts,
  getProductsBySubcategory,
  getAllCategories,
  getProductById,
  createProduct,
  seedProducts,
} from "../controllers/productController.js";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Get seller shop details by sellerId
router.get(
  "/shop/:sellerId",
  [param("sellerId").isMongoId().withMessage("Valid seller ID required")],
  validateRequest,
  getSellerShop,
);

// Get all products (scraped + seller products)
router.get("/", getAllProducts);

// Get products by subcategory (scraped + seller products)
router.get("/subcategory/:subcategory", getProductsBySubcategory);

// Get all categories with subcategories
router.get("/categories/all", getAllCategories);

// Get single product (check both Product and SellerProduct)
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Valid product ID required")],
  validateRequest,
  getProductById,
);

// Create product (for testing)
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ],
  validateRequest,
  createProduct,
);


export default router;
