import express from "express";
import {
  getHomePageProducts,
  scrapeCategoryProducts,
  scrapeSimilarProducts,
  handleBuyAction,
  triggerManualHomeScrape,
} from "../controllers/scrapingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get home page products (from cron cache)
router.get("/home/products", getHomePageProducts);

// Scrape category products (top 5 from each store)
router.get("/category/:category", scrapeCategoryProducts);

// Scrape similar products for a specific product
router.post("/similar-products", scrapeSimilarProducts);

// Handle buy action - requires authentication
router.post("/buy", authMiddleware, handleBuyAction);

// Manual trigger for home scraping (for testing/admin)
router.post("/trigger-home-scrape", triggerManualHomeScrape);

export default router;
