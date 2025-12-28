import cron from "node-cron";
import scraperManager from "./scraperManager.js";
import { CATEGORIES } from "./config.js";
import ScrapedProduct from "../models/ScrapedProduct.js";

let homeProductsCache = {};
let lastScrapedTime = null;

// Function to scrape products for home page
async function scrapeHomeProducts() {
  console.log("🔄 Starting home page scraping...");
  const startTime = Date.now();

  try {
    const scrapedData = {};

    // Scrape 4 products from each category
    for (const [category, keywords] of Object.entries(CATEGORIES)) {
      console.log(`\n📦 Scraping category: ${category}`);
      scrapedData[category] = [];

      // Take first keyword from each category for home page
      const keyword = keywords[0];

      try {
        // Scrape from all stores with error handling
        const storeResults = await scraperManager
          .scrapeAllStores(keyword, 4)
          .catch((error) => {
            console.error(`Error scraping ${keyword}:`, error.message);
            return { amazon: [], flipkart: [], myntra: [] };
          });

        const allProducts = scraperManager.getAllProducts(storeResults);

        // Get top 4 products by best price
        const topProducts = scraperManager
          .sortByPrice(allProducts, true)
          .slice(0, 4);

        // Add category to each product
        const productsWithCategory = topProducts.map((p) => ({
          ...p,
          category,
          scrapedAt: new Date(),
        }));

        scrapedData[category] = productsWithCategory;
        console.log(
          `✓ Got ${productsWithCategory.length} products for ${category}`
        );
      } catch (error) {
        console.error(`✗ Error scraping ${category}:`, error.message);
        scrapedData[category] = [];
      }

      // Delay between categories to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // Update cache
    homeProductsCache = scrapedData;
    lastScrapedTime = new Date();

    // Save to database
    await saveScrapedProducts(scrapedData).catch((error) => {
      console.error("Error saving to database:", error.message);
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Home page scraping completed in ${duration}s`);
    console.log(
      `📊 Total products scraped: ${Object.values(scrapedData).reduce(
        (sum, arr) => sum + arr.length,
        0
      )}`
    );
  } catch (error) {
    console.error("❌ Home page scraping failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Save scraped products to database
async function saveScrapedProducts(scrapedData) {
  try {
    // Clear old home page products
    await ScrapedProduct.deleteMany({ scraperType: "home" });

    // Save new products
    const productsToSave = [];
    Object.entries(scrapedData).forEach(([category, products]) => {
      products.forEach((product) => {
        productsToSave.push({
          ...product,
          scraperType: "home",
          category,
        });
      });
    });

    if (productsToSave.length > 0) {
      await ScrapedProduct.insertMany(productsToSave);
      console.log(`💾 Saved ${productsToSave.length} products to database`);
    }
  } catch (error) {
    console.error("❌ Error saving products to database:", error);
  }
}

// Get cached home products
export function getHomeProducts() {
  return {
    categories: homeProductsCache,
    lastScraped: lastScrapedTime,
    totalProducts: Object.values(homeProductsCache).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
  };
}

// Initialize cron job - Run every 6 hours
export function initializeCronJobs() {
  console.log("⏰ Initializing cron jobs...");

  // Run immediately on startup
  scrapeHomeProducts();

  // Schedule to run every 6 hours
  cron.schedule("0 */6 * * *", () => {
    console.log("\n⏰ Cron job triggered: Scraping home page products");
    scrapeHomeProducts();
  });

  console.log("✅ Cron jobs initialized - Home scraping every 6 hours");
}

// Manual trigger for testing
export function triggerManualScrape() {
  return scrapeHomeProducts();
}
