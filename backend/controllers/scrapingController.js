import scraperManager from "../scrapers/scraperManager.js";
import { CATEGORIES } from "../scrapers/config.js";
import { imageManager } from "../scrapers/imageMapping.js";
import {
  getHomeProducts,
  triggerManualScrape,
} from "../scrapers/cronScraper.js";
import ScrapedProduct from "../models/ScrapedProduct.js";
import MyHistory from "../models/MyHistory.js";

// Get home page products (from cache/cron)
export const getHomePageProducts = async (req, res) => {
  try {
    const cachedData = getHomeProducts();

    if (cachedData.totalProducts > 0) {
      return res.json({
        success: true,
        data: cachedData,
        source: "cache",
      });
    }

    // If cache is empty, try to get from database
    const dbProducts = await ScrapedProduct.find({ scraperType: "home" }).sort({
      scrapedAt: -1,
    });

    if (dbProducts.length > 0) {
      // Organize by category
      const categories = {};
      dbProducts.forEach((product) => {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      });

      return res.json({
        success: true,
        data: {
          categories,
          lastScraped: dbProducts[0].scrapedAt,
          totalProducts: dbProducts.length,
        },
        source: "database",
      });
    }

    // If no data, return empty
    res.json({
      success: true,
      data: {
        categories: {},
        lastScraped: null,
        totalProducts: 0,
      },
      source: "empty",
    });
  } catch (error) {
    console.error("Error getting home products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch home products",
    });
  }
};

// Scrape products for specific category (top 5 from each store)
export const scrapeCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;

    if (!CATEGORIES[category]) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    console.log(`🔍 Scraping category: ${category}`);
    const keywords = CATEGORIES[category];
    const allProducts = [];

    // Scrape for all keywords in the category
    for (const keyword of keywords) {
      const storeResults = await scraperManager.scrapeAllStores(keyword, 5);
      const products = scraperManager.getAllProducts(storeResults);

      // Add category to products and ensure valid images
      const productsWithCategory = products.map((p) => ({
        ...p,
        category,
        keyword,
        image:
          p.image ||
          imageManager.getImageForProduct(category, p.name) ||
          imageManager.getDefaultImage(),
      }));

      allProducts.push(...productsWithCategory);
    }

    // Sort by price and get unique products
    const sortedProducts = scraperManager.sortByPrice(allProducts, true);

    res.json({
      success: true,
      data: {
        category,
        products: sortedProducts,
        totalProducts: sortedProducts.length,
        scrapedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error scraping category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to scrape category products",
    });
  }
};

// Scrape similar products for a specific product (top 3 from each store)
export const scrapeSimilarProducts = async (req, res) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    console.log(`🔍 Scraping similar products for: ${productName}`);

    // Scrape from all stores
    const storeResults = await scraperManager.scrapeAllStores(productName, 3);

    // Ensure all products in all stores have valid data
    const validatedStoreResults = {};
    for (const [storeName, products] of Object.entries(storeResults)) {
      validatedStoreResults[storeName] = products.map((product) => ({
        ...product,
        category: product.category || "Electronics",
        image:
          product.image ||
          imageManager.getImageForProduct(
            product.category || "Electronics",
            product.name
          ) ||
          imageManager.getDefaultImage(),
      }));
    }

    res.json({
      success: true,
      data: {
        productName,
        stores: validatedStoreResults,
        scrapedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error scraping similar products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to scrape similar products",
    });
  }
};

// Handle buy action - Save to myHistory and return product URL
export const handleBuyAction = async (req, res) => {
  try {
    const {
      userId,
      productName,
      storeName,
      storeId,
      originalPrice,
      finalPrice,
      productUrl,
    } = req.body;

    // Validate required fields
    if (!userId || !productName || !storeName || !finalPrice || !productUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Calculate saved amount
    const savedAmount = (originalPrice || finalPrice) - finalPrice;

    // Save to myHistory
    const historyEntry = await MyHistory.create({
      userId,
      productId: storeId || "unknown",
      productName,
      storeId: storeId || "unknown",
      storeName,
      originalPrice: originalPrice || finalPrice,
      finalPrice,
      savedAmount: savedAmount > 0 ? savedAmount : 0,
      productUrl,
    });

    console.log(
      `✅ Purchase saved to history: ${productName} from ${storeName}`
    );

    res.json({
      success: true,
      message: "Purchase recorded successfully",
      data: {
        historyId: historyEntry._id,
        productUrl,
        savedAmount,
      },
    });
  } catch (error) {
    console.error("Error handling buy action:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record purchase",
    });
  }
};

// Manual trigger for cron scraping (for testing)
export const triggerManualHomeScrape = async (req, res) => {
  try {
    console.log("🔧 Manual scraping triggered");

    // Trigger scraping in background
    triggerManualScrape().catch((err) => {
      console.error("Background scraping error:", err);
    });

    res.json({
      success: true,
      message: "Scraping started in background",
    });
  } catch (error) {
    console.error("Error triggering manual scrape:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger scraping",
    });
  }
};
