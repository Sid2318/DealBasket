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

class MyntraScraper extends BaseScraper {
  constructor() {
    super();
    this.config = STORES.MYNTRA;
  }

  // Generate mock data for Myntra when scraping fails or returns invalid prices
  generateMockData(query, limit = 5) {
    const mockProducts = [];
    const basePrice = Math.floor(Math.random() * 40000) + 3000; // 3000-43000

    // Common product variants and specifications
    const variants = [
      "Slim Fit",
      "Regular Fit",
      "Casual",
      "Formal",
      "Trending",
      "Classic",
      "Modern",
      "Designer",
    ];
    const specs = [
      "Cotton",
      "Polyester",
      "Denim",
      "Medium",
      "Large",
      "XL",
      "Black",
      "Blue",
    ];
    const brands = [
      "Roadster",
      "H&M",
      "Zara",
      "Levis",
      "Nike",
      "Puma",
      "Adidas",
      "Allen Solly",
    ];

    for (let i = 0; i < limit; i++) {
      const price = basePrice + i * 800 - Math.random() * 1600;
      const originalPrice = price + price * (Math.random() * 0.4 + 0.2); // 20-60% discount
      const imageId = Math.floor(Math.random() * 1000) + 300;

      const variant = variants[Math.floor(Math.random() * variants.length)];
      const spec = specs[Math.floor(Math.random() * specs.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const productName = `${brand} ${variant} ${query} - ${spec}`;

      mockProducts.push({
        name: productName,
        price: Math.round(price),
        originalPrice: Math.round(originalPrice),
        discount: Math.round(((originalPrice - price) / originalPrice) * 100),
        image:
          imageManager.getImageForProduct("Fashion", productName) ||
          imageManager.getDefaultImage(),
        productUrl: `https://www.myntra.com/${encodeURIComponent(query)}`,
        store: this.config.name,
        storeId: "myntra",
      });
    }

    return mockProducts;
  }

  async searchProducts(query, limit = 5) {
    const products = [];

    try {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error("Failed to initialize Myntra scraper");
        return this.generateMockData(query, limit);
      }

      const searchUrl = `${this.config.baseUrl}/${encodeURIComponent(query)}`;
      const navigated = await this.navigateToUrl(searchUrl);

      if (!navigated) {
        console.error("Failed to navigate to Myntra search page");
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
      console.log(`Found ${productElements.length} products on Myntra`);
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
            `Myntra Product - Title: ${title ? "Found" : "Missing"}, Price: ${
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

            // Determine category based on query
            const category = determineCategoryFromQuery(query);
            const productImage =
              imageUrl ||
              imageManager.getImageForProduct(category, title) ||
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
                `${this.config.baseUrl}/${encodeURIComponent(query)}`,
              store: this.config.name,
              storeId: "myntra",
            });

            console.log(`✓ Added Myntra product: ${title.substring(0, 50)}...`);
          }
        } catch (error) {
          console.error("Error extracting Myntra product:", error.message);
        }
      }

      console.log(
        `Successfully scraped ${products.length} products from Myntra`
      );
    } catch (error) {
      console.error("Myntra scraper error:", error);
    } finally {
      await this.close();
    }

    // If no valid products were scraped, return mock data
    if (products.length === 0) {
      console.log(
        `No valid products scraped from Myntra, using mock data for: ${query}`
      );
      return this.generateMockData(query, limit);
    }

    return products;
  }
}

export default MyntraScraper;
