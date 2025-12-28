// Configuration for scraping different websites

export const CATEGORIES = {
  Electronics: ["laptop", "phone", "headphones", "tablet"],
  Fashion: ["shirt", "jeans", "shoes", "jacket"],
  Grocery: ["rice", "oil", "sugar", "flour"],
  Beauty: ["lipstick", "perfume", "cream", "shampoo"],
  Lifestyle: ["watch", "bag", "sunglasses", "wallet"],
};

export const STORES = {
  AMAZON: {
    name: "Amazon",
    baseUrl: "https://www.amazon.in",
    searchUrl: "https://www.amazon.in/s?k=",
    selectors: {
      productCard: '[data-component-type="s-search-result"]',
      title: "h2 a span",
      price: ".a-price-whole",
      originalPrice: ".a-price.a-text-price .a-offscreen",
      image: ".s-image",
      link: "h2 a",
      rating: ".a-icon-alt",
    },
  },
  FLIPKART: {
    name: "Flipkart",
    baseUrl: "https://www.flipkart.com",
    searchUrl: "https://www.flipkart.com/search?q=",
    selectors: {
      productCard: "._1AtVbE",
      title: "._4rR01T",
      price: "._30jeq3",
      originalPrice: "._3I9_wc",
      image: "._396cs4",
      link: "._1fQZEK",
      rating: "._3LWZlK",
    },
  },
  MYNTRA: {
    name: "Myntra",
    baseUrl: "https://www.myntra.com",
    searchUrl: "https://www.myntra.com/",
    selectors: {
      productCard: ".product-base",
      title: ".product-product",
      price: ".product-discountedPrice",
      originalPrice: ".product-strike",
      image: "img",
      link: "a",
      rating: ".product-ratingsContainer",
    },
  },
};

export const SCRAPING_OPTIONS = {
  headless: true,
  timeout: 30000,
  waitForSelector: 2000,
  maxRetries: 3,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};
