import AmazonScraper from "./amazonScraper.js";
import FlipkartScraper from "./flipkartScraper.js";
import MyntraScraper from "./myntraScraper.js";

class ScraperManager {
  constructor() {
    this.scrapers = {
      amazon: AmazonScraper,
      flipkart: FlipkartScraper,
      myntra: MyntraScraper,
    };
  }

  async scrapeAllStores(query, limit = 5) {
    const results = {
      amazon: [],
      flipkart: [],
      myntra: [],
    };

    // Scrape stores sequentially to avoid overwhelming the system
    for (const storeName of Object.keys(this.scrapers)) {
      try {
        console.log(`\n🔍 Starting scrape for ${storeName}...`);
        const ScraperClass = this.scrapers[storeName];
        const scraper = new ScraperClass();
        const products = await scraper.searchProducts(query, limit);
        results[storeName] = products;
        console.log(
          `✓ Scraped ${products.length} products from ${storeName} for query: ${query}`
        );
      } catch (error) {
        console.error(`✗ Failed to scrape ${storeName}:`, error.message);
        results[storeName] = [];
      }

      // Small delay between stores
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return results;
  }

  async scrapeStore(storeName, query, limit = 5) {
    try {
      const ScraperClass = this.scrapers[storeName.toLowerCase()];
      if (!ScraperClass) {
        throw new Error(`Scraper for ${storeName} not found`);
      }

      const scraper = new ScraperClass();
      const products = await scraper.searchProducts(query, limit);
      console.log(
        `✓ Scraped ${products.length} products from ${storeName} for query: ${query}`
      );
      return products;
    } catch (error) {
      console.error(`✗ Failed to scrape ${storeName}:`, error.message);
      return [];
    }
  }

  getAllProducts(storeResults) {
    const allProducts = [];
    Object.keys(storeResults).forEach((store) => {
      allProducts.push(...storeResults[store]);
    });
    return allProducts;
  }

  sortByPrice(products, ascending = true) {
    return products.sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
  }

  getBestDeals(storeResults, limit = 10) {
    const allProducts = this.getAllProducts(storeResults);
    return this.sortByPrice(allProducts, true).slice(0, limit);
  }
}

export default new ScraperManager();
