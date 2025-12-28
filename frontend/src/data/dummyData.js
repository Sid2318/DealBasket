// Dummy data for testing without backend

// Stores
export const stores = [
  {
    _id: "store1",
    name: "Amazon",
    website: "https://amazon.in",
  },
  {
    _id: "store2",
    name: "Flipkart",
    website: "https://flipkart.com",
  },
  {
    _id: "store3",
    name: "Myntra",
    website: "https://myntra.com",
  },
];

// Categories
export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Beauty",
  "Grocery",
  "Lifestyle",
];

// Products
export const products = [
  {
    _id: "prod1",
    name: "Dell Laptop",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300",
  },
  {
    _id: "prod2",
    name: "Samsung Galaxy S23",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300",
  },
  {
    _id: "prod3",
    name: "Nike Running Shoes",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
  },
  {
    _id: "prod4",
    name: "Sony Headphones",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
  },
  {
    _id: "prod5",
    name: "Casual T-Shirt",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
  },
  {
    _id: "prod6",
    name: "Smart Watch",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
  },
  {
    _id: "prod7",
    name: "Organic Rice 5kg",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300",
  },
  {
    _id: "prod8",
    name: "Fresh Vegetables Pack",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300",
  },
  {
    _id: "prod9",
    name: "Moisturizer Cream",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
  },
  {
    _id: "prod10",
    name: "Lipstick Set",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300",
  },
  {
    _id: "prod11",
    name: "Yoga Mat",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300",
  },
  {
    _id: "prod12",
    name: "Scented Candles",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1602874801007-62ccfaa4b3e7?w=300",
  },
  {
    _id: "prod13",
    name: "Denim Jeans",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300",
  },
  {
    _id: "prod14",
    name: "Sunglasses",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300",
  },
  {
    _id: "prod15",
    name: "Coffee Beans 1kg",
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300",
  },
];

// Prices (mapped by productId)
export const prices = {
  prod1: [
    {
      _id: "price1",
      productId: "prod1",
      storeId: stores[0],
      originalPrice: 55000,
      discountedPrice: 48000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price2",
      productId: "prod1",
      storeId: stores[1],
      originalPrice: 55000,
      discountedPrice: 45000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price3",
      productId: "prod1",
      storeId: stores[2],
      originalPrice: 55000,
      discountedPrice: 50000,
      date: new Date("2024-01-15"),
    },
  ],
  prod2: [
    {
      _id: "price4",
      productId: "prod2",
      storeId: stores[0],
      originalPrice: 75000,
      discountedPrice: 68000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price5",
      productId: "prod2",
      storeId: stores[1],
      originalPrice: 75000,
      discountedPrice: 65000,
      date: new Date("2024-01-15"),
    },
  ],
  prod3: [
    {
      _id: "price6",
      productId: "prod3",
      storeId: stores[0],
      originalPrice: 8000,
      discountedPrice: 6500,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price7",
      productId: "prod3",
      storeId: stores[1],
      originalPrice: 8000,
      discountedPrice: 6000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price8",
      productId: "prod3",
      storeId: stores[2],
      originalPrice: 8000,
      discountedPrice: 6200,
      date: new Date("2024-01-15"),
    },
  ],
  prod4: [
    {
      _id: "price9",
      productId: "prod4",
      storeId: stores[0],
      originalPrice: 15000,
      discountedPrice: 12000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price10",
      productId: "prod4",
      storeId: stores[1],
      originalPrice: 15000,
      discountedPrice: 11500,
      date: new Date("2024-01-15"),
    },
  ],
  prod5: [
    {
      _id: "price11",
      productId: "prod5",
      storeId: stores[1],
      originalPrice: 1500,
      discountedPrice: 1200,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price12",
      productId: "prod5",
      storeId: stores[2],
      originalPrice: 1500,
      discountedPrice: 999,
      date: new Date("2024-01-15"),
    },
  ],
  prod6: [
    {
      _id: "price13",
      productId: "prod6",
      storeId: stores[0],
      originalPrice: 25000,
      discountedPrice: 22000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price14",
      productId: "prod6",
      storeId: stores[1],
      originalPrice: 25000,
      discountedPrice: 21000,
      date: new Date("2024-01-15"),
    },
  ],
  prod7: [
    {
      _id: "price15",
      productId: "prod7",
      storeId: stores[0],
      originalPrice: 500,
      discountedPrice: 450,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price16",
      productId: "prod7",
      storeId: stores[1],
      originalPrice: 500,
      discountedPrice: 430,
      date: new Date("2024-01-15"),
    },
  ],
  prod8: [
    {
      _id: "price17",
      productId: "prod8",
      storeId: stores[0],
      originalPrice: 300,
      discountedPrice: 250,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price18",
      productId: "prod8",
      storeId: stores[1],
      originalPrice: 300,
      discountedPrice: 240,
      date: new Date("2024-01-15"),
    },
  ],
  prod9: [
    {
      _id: "price19",
      productId: "prod9",
      storeId: stores[0],
      originalPrice: 1200,
      discountedPrice: 999,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price20",
      productId: "prod9",
      storeId: stores[2],
      originalPrice: 1200,
      discountedPrice: 950,
      date: new Date("2024-01-15"),
    },
  ],
  prod10: [
    {
      _id: "price21",
      productId: "prod10",
      storeId: stores[2],
      originalPrice: 2500,
      discountedPrice: 2000,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price22",
      productId: "prod10",
      storeId: stores[1],
      originalPrice: 2500,
      discountedPrice: 1999,
      date: new Date("2024-01-15"),
    },
  ],
  prod11: [
    {
      _id: "price23",
      productId: "prod11",
      storeId: stores[0],
      originalPrice: 1500,
      discountedPrice: 1200,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price24",
      productId: "prod11",
      storeId: stores[1],
      originalPrice: 1500,
      discountedPrice: 1150,
      date: new Date("2024-01-15"),
    },
  ],
  prod12: [
    {
      _id: "price25",
      productId: "prod12",
      storeId: stores[0],
      originalPrice: 800,
      discountedPrice: 650,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price26",
      productId: "prod12",
      storeId: stores[2],
      originalPrice: 800,
      discountedPrice: 600,
      date: new Date("2024-01-15"),
    },
  ],
  prod13: [
    {
      _id: "price27",
      productId: "prod13",
      storeId: stores[2],
      originalPrice: 3000,
      discountedPrice: 2400,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price28",
      productId: "prod13",
      storeId: stores[1],
      originalPrice: 3000,
      discountedPrice: 2350,
      date: new Date("2024-01-15"),
    },
  ],
  prod14: [
    {
      _id: "price29",
      productId: "prod14",
      storeId: stores[2],
      originalPrice: 2000,
      discountedPrice: 1600,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price30",
      productId: "prod14",
      storeId: stores[0],
      originalPrice: 2000,
      discountedPrice: 1550,
      date: new Date("2024-01-15"),
    },
  ],
  prod15: [
    {
      _id: "price31",
      productId: "prod15",
      storeId: stores[0],
      originalPrice: 700,
      discountedPrice: 600,
      date: new Date("2024-01-15"),
    },
    {
      _id: "price32",
      productId: "prod15",
      storeId: stores[1],
      originalPrice: 700,
      discountedPrice: 580,
      date: new Date("2024-01-15"),
    },
  ],
};

// Purchase History
export const purchaseHistory = [
  {
    _id: "purchase1",
    productId: "prod2",
    productName: "Samsung Galaxy S23",
    storeId: "store2",
    storeName: "Flipkart",
    originalPrice: 75000,
    finalPrice: 65000,
    savedAmount: 10000,
    purchasedAt: new Date("2024-12-20"),
  },
  {
    _id: "purchase2",
    productId: "prod3",
    productName: "Nike Running Shoes",
    storeId: "store2",
    storeName: "Flipkart",
    originalPrice: 8000,
    finalPrice: 6000,
    savedAmount: 2000,
    purchasedAt: new Date("2024-12-18"),
  },
  {
    _id: "purchase3",
    productId: "prod4",
    productName: "Sony Headphones",
    storeId: "store2",
    storeName: "Flipkart",
    originalPrice: 15000,
    finalPrice: 11500,
    savedAmount: 3500,
    purchasedAt: new Date("2024-12-15"),
  },
  {
    _id: "purchase4",
    productId: "prod5",
    productName: "Casual T-Shirt",
    storeId: "store3",
    storeName: "Myntra",
    originalPrice: 1500,
    finalPrice: 999,
    savedAmount: 501,
    purchasedAt: new Date("2024-12-10"),
  },
];

// Helper function to get prices for a product
export const getPricesForProduct = (productId) => {
  const productPrices = prices[productId] || [];
  const sorted = [...productPrices].sort(
    (a, b) => a.discountedPrice - b.discountedPrice
  );

  return {
    bestDeal: sorted[0],
    allPrices: sorted,
  };
};

// Helper function to calculate total savings
export const getTotalSavings = () => {
  return purchaseHistory.reduce(
    (total, purchase) => total + purchase.savedAmount,
    0
  );
};

// Helper function to add a purchase
export const addPurchase = (purchaseData) => {
  const newPurchase = {
    _id: `purchase${purchaseHistory.length + 1}`,
    ...purchaseData,
    purchasedAt: new Date(),
  };
  purchaseHistory.push(newPurchase);
  return newPurchase;
};
