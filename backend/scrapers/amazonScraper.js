import BaseScraper from "./baseScraper.js";
import { STORES } from "./config.js";
import { imageManager } from "./imageMapping.js";
import {
  getRandomItem,
  getVariants,
  getSpecs,
  getBrands,
  determineCategoryFromQuery,
} from "./productData.js";

class AmazonScraper extends BaseScraper {
  constructor() {
    super();
    this.config = STORES.AMAZON;
  }

  // Generate mock data for Amazon when scraping fails or returns invalid prices
  generateMockData(query, limit = 5) {
    const mockProducts = [];
    const basePrice = Math.floor(Math.random() * 50000) + 5000; // 5000-55000

    // Determine category from query to get appropriate brands
    const category = determineCategoryFromQuery(query);
    const variants = getVariants(category);
    const specs = getSpecs(category);
    const brands = getBrands("Amazon", category);

    for (let i = 0; i < limit; i++) {
      const price = basePrice + i * 1000 - Math.random() * 2000;
      const originalPrice = price + price * (Math.random() * 0.3 + 0.1); // 10-40% discount

      const variant = getRandomItem(variants);
      const spec = getRandomItem(specs);
      const brand = getRandomItem(brands);
      const productName = `${brand} ${query} ${variant} ${spec}`;

      mockProducts.push({
        name: productName,
        price: Math.round(price),
        originalPrice: Math.round(originalPrice),
        discount: Math.round(((originalPrice - price) / originalPrice) * 100),
        image:
          imageManager.getImageForProduct("Electronics", productName) ||
          imageManager.getDefaultImage(),
        productUrl: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
        store: this.config.name,
        storeId: "amazon",
      });
    }

    return mockProducts;
  }

  async searchProducts(query, limit = 5) {
    const products = [];

    try {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error("Failed to initialize Amazon scraper");
        return this.generateMockData(query, limit);
      }

      const searchUrl = `${this.config.searchUrl}${encodeURIComponent(query)}`;
      const navigated = await this.navigateToUrl(searchUrl);

      if (!navigated) {
        console.error("Failed to navigate to Amazon search page");
        await this.close();
        return this.generateMockData(query, limit);
      }

      await this.delay(2000);

      // Wait for product cards to load
      const loaded = await this.waitForElement(
        this.config.selectors.productCard
      );
      if (!loaded) {
        console.log("Product cards not found, using mock data");
        await this.close();
        return this.generateMockData(query, limit);
      }

      const productElements = await this.page.$$(
        this.config.selectors.productCard
      );
      console.log(`Found ${productElements.length} products on Amazon`);
      const limitedElements = productElements.slice(0, limit * 2); // Get more to filter out invalid ones

      for (const element of limitedElements) {
        if (products.length >= limit) break;

        try {
          const title = await this.extractText(
            element,
            this.config.selectors.title
          );
          const priceStr = await this.extractText(
            element,
            this.config.selectors.price
          );
          const originalPriceStr = await this.extractText(
            element,
            this.config.selectors.originalPrice
          );
          const imageUrl = await this.extractImageUrl(
            element,
            this.config.selectors.image
          );
          const productLink = await this.extractAttribute(
            element,
            this.config.selectors.link,
            "href"
          );

          console.log(
            `Amazon Product - Title: ${title ? "Found" : "Missing"}, Price: ${
              priceStr || "N/A"
            }, Image: ${imageUrl ? "Found" : "Missing"}`
          );

          if (title && priceStr) {
            const price = this.cleanPrice(priceStr);
            const originalPrice = this.cleanPrice(originalPriceStr) || price;

            // Skip if price is invalid
            if (price < 10) {
              console.log(`Skipping product with invalid price: ${price}`);
              continue;
            }

            // Construct full URL - check if link is already absolute
            let fullUrl = "";
            if (productLink) {
              fullUrl = productLink.startsWith("http")
                ? productLink
                : `${this.config.baseUrl}${productLink}`;
            }

            // Use image manager to get unique image - ensure never blank
            const productImage =
              imageUrl ||
              imageManager.getImageForProduct("Electronics", title) ||
              imageManager.getDefaultImage();

            products.push({
              name: title,
              price: price,
              originalPrice: originalPrice,
              discount:
                originalPrice > price
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0,
              image: productImage,
              productUrl:
                fullUrl ||
                `${this.config.baseUrl}/s?k=${encodeURIComponent(query)}`,
              store: this.config.name,
              storeId: "amazon",
            });

            console.log(`✓ Added Amazon product: ${title.substring(0, 50)}...`);
          }
        } catch (error) {
          console.error("Error extracting Amazon product:", error.message);
        }
      }

      console.log(
        `Successfully scraped ${products.length} products from Amazon`
      );
    } catch (error) {
      console.error("Amazon scraper error:", error);
    } finally {
      await this.close();
    }

    // If no valid products were scraped, return mock data
    if (products.length === 0) {
      console.log(
        `No valid products scraped from Amazon, using mock data for: ${query}`
      );
      return this.generateMockData(query, limit);
    }

    return products;
  }
}

export default AmazonScraper;
