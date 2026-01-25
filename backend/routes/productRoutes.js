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

const router = express.Router();

// Get seller shop details by sellerId
router.get("/shop/:sellerId", getSellerShop);

// Get all products (scraped + seller products)
router.get("/", getAllProducts);

// Get products by subcategory (scraped + seller products)
router.get("/subcategory/:subcategory", getProductsBySubcategory);

// Get all categories with subcategories
router.get("/categories/all", getAllCategories);

// Get single product (check both Product and SellerProduct)
router.get("/:id", getProductById);

// Create product (for testing)
router.post("/", createProduct);

// Seed data (for testing)
router.post("/seed", seedProducts);

export default router;
