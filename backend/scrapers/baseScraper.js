import puppeteer from "puppeteer";
import { SCRAPING_OPTIONS } from "./config.js";

class BaseScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: SCRAPING_OPTIONS.headless,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
          "--window-size=1920,1080",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
        timeout: 60000,
      });
      this.page = await this.browser.newPage();

      // Set longer timeout for navigation
      this.page.setDefaultNavigationTimeout(60000);
      this.page.setDefaultTimeout(60000);

      await this.page.setUserAgent(SCRAPING_OPTIONS.userAgent);
      await this.page.setViewport({ width: 1920, height: 1080 });

      // Handle page errors
      this.page.on("error", (error) => {
        console.error("Page crashed:", error);
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      return false;
    }
  }

  async navigateToUrl(url, retries = SCRAPING_OPTIONS.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        // Small delay to let dynamic content load
        await this.delay(1000);
        return true;
      } catch (error) {
        console.error(`Navigation attempt ${i + 1} failed:`, error.message);
        if (
          error.message.includes("ECONNRESET") ||
          error.message.includes("net::ERR")
        ) {
          console.log("Connection reset, retrying...");
        }
        if (i === retries - 1) {
          console.error(`Failed to navigate after ${retries} attempts`);
          return false;
        }
        // Exponential backoff
        await this.delay(2000 * (i + 1));
      }
    }
    return false;
  }

  async waitForElement(selector, timeout = SCRAPING_OPTIONS.waitForSelector) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.error(`Element ${selector} not found:`, error.message);
      return false;
    }
  }

  async extractText(element, selector) {
    try {
      const text = await element.$eval(selector, (el) => el.textContent.trim());
      return text;
    } catch (error) {
      return "";
    }
  }

  async extractAttribute(element, selector, attribute) {
    try {
      const attr = await element.$eval(
        selector,
        (el, attr) => {
          // For images, try multiple attributes (src, data-src, data-lazy-src)
          if (attr === "src" && el.tagName === "IMG") {
            return (
              el.getAttribute("data-src") ||
              el.getAttribute("data-lazy-src") ||
              el.getAttribute("src") ||
              el.currentSrc
            );
          }
          return el.getAttribute(attr);
        },
        attribute
      );
      return attr;
    } catch (error) {
      return "";
    }
  }

  async extractImageUrl(element, selector) {
    try {
      // Try to get image from multiple possible attributes
      const imageUrl = await element.$eval(selector, (el) => {
        if (el.tagName === "IMG") {
          return (
            el.getAttribute("data-src") ||
            el.getAttribute("data-lazy-src") ||
            el.getAttribute("src") ||
            el.currentSrc ||
            el.getAttribute("data-image-src")
          );
        }
        // If not an img tag, look for img inside
        const img = el.querySelector("img");
        if (img) {
          return (
            img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src") ||
            img.getAttribute("src") ||
            img.currentSrc ||
            img.getAttribute("data-image-src")
          );
        }
        return "";
      });
      return imageUrl;
    } catch (error) {
      return "";
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  cleanPrice(priceStr) {
    if (!priceStr) return 0;
    // Remove currency symbols, commas, and other non-numeric characters except decimal point
    const cleaned = priceStr.replace(/[₹,\s]/g, "").replace(/[^0-9.]/g, "");
    const price = parseFloat(cleaned) || 0;

    // Validate price - should be reasonable for Indian market (min 10 rupees)
    if (price < 10) {
      console.warn(`Invalid price detected: ${priceStr} -> ${price}`);
      return 0;
    }

    return price;
  }

  async close() {
    try {
      if (this.page) {
        await this.page.close().catch(() => {});
      }
      if (this.browser) {
        await this.browser.close().catch(() => {});
      }
    } catch (error) {
      console.error("Error closing browser:", error.message);
    }
  }
}

export default BaseScraper;
