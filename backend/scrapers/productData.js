// Product variants, specifications, and brand data for mock product generation

export const PRODUCT_VARIANTS = {
  Electronics: [
    "Pro",
    "Plus",
    "Ultra",
    "Premium",
    "Standard",
    "Basic",
    "Elite",
    "Max",
    "Advanced",
    "Limited Edition",
  ],
  Fashion: [
    "Slim Fit",
    "Regular Fit",
    "Casual",
    "Formal",
    "Trending",
    "Classic",
    "Modern",
    "Designer",
    "Premium",
    "Comfort",
  ],
  Grocery: [
    "Premium",
    "Organic",
    "Natural",
    "Pure",
    "Traditional",
    "Fresh",
    "Select",
    "Quality",
    "Best",
    "Super",
  ],
  Beauty: [
    "Pro",
    "Premium",
    "Luxury",
    "Natural",
    "Organic",
    "Ultimate",
    "Perfect",
    "Radiant",
    "Glow",
    "Matte",
  ],
  Lifestyle: [
    "Premium",
    "Classic",
    "Luxury",
    "Sport",
    "Casual",
    "Formal",
    "Trendy",
    "Elegant",
    "Modern",
    "Vintage",
  ],
};

export const PRODUCT_SPECS = {
  Electronics: [
    "64GB",
    "128GB",
    "256GB",
    "512GB",
    "Black",
    "White",
    "Blue",
    "Silver",
    "Gold",
    "Rose Gold",
    "4GB RAM",
    "8GB RAM",
    "16GB RAM",
  ],
  Fashion: [
    "Cotton",
    "Polyester",
    "Denim",
    "Leather",
    "Medium",
    "Large",
    "XL",
    "XXL",
    "Black",
    "Blue",
    "White",
    "Grey",
    "Navy",
  ],
  Grocery: [
    "1kg",
    "2kg",
    "5kg",
    "10kg",
    "500g",
    "1L",
    "2L",
    "5L",
    "500ml",
    "Pack of 2",
    "Pack of 5",
    "Combo Pack",
  ],
  Beauty: [
    "50ml",
    "100ml",
    "200ml",
    "30g",
    "50g",
    "100g",
    "Matte",
    "Glossy",
    "Natural",
    "Waterproof",
    "Long-lasting",
  ],
  Lifestyle: [
    "Leather",
    "Canvas",
    "Metal",
    "Plastic",
    "Black",
    "Brown",
    "Blue",
    "Silver",
    "Gold",
    "One Size",
    "Universal",
  ],
};

export const PRODUCT_BRANDS = {
  Electronics: {
    Amazon: [
      "Samsung",
      "Apple",
      "Sony",
      "LG",
      "OnePlus",
      "Realme",
      "Xiaomi",
      "Oppo",
    ],
    Flipkart: [
      "Samsung",
      "Mi",
      "Realme",
      "Vivo",
      "Oppo",
      "Motorola",
      "Nokia",
      "Infinix",
    ],
    Myntra: [
      "Samsung",
      "Apple",
      "Boat",
      "JBL",
      "Sony",
      "Noise",
      "Realme",
      "OnePlus",
    ],
  },
  Fashion: {
    Amazon: [
      "Levi's",
      "Nike",
      "Adidas",
      "Puma",
      "Roadster",
      "H&M",
      "Zara",
      "Peter England",
    ],
    Flipkart: [
      "Roadster",
      "Nike",
      "Puma",
      "Campus",
      "Flying Machine",
      "Indian Terrain",
      "Wrangler",
      "Lee",
    ],
    Myntra: [
      "Roadster",
      "H&M",
      "Zara",
      "Levi's",
      "Nike",
      "Puma",
      "Adidas",
      "Allen Solly",
    ],
  },
  Grocery: {
    Amazon: [
      "India Gate",
      "Fortune",
      "Aashirvaad",
      "Tata",
      "Britannia",
      "Amul",
      "Mother Dairy",
      "Nestle",
    ],
    Flipkart: [
      "India Gate",
      "Daawat",
      "Fortune",
      "Aashirvaad",
      "Tata",
      "Patanjali",
      "Ashok",
      "Nature Fresh",
    ],
    Myntra: [
      "Healthy Buddha",
      "True Elements",
      "Yoga Bar",
      "Raw Pressery",
      "Epigamia",
      "Paper Boat",
      "Organic India",
      "Pure",
    ],
  },
  Beauty: {
    Amazon: [
      "Maybelline",
      "L'Oreal",
      "Lakme",
      "MAC",
      "Colorbar",
      "Nykaa",
      "Sugar",
      "Plum",
    ],
    Flipkart: [
      "Lakme",
      "Maybelline",
      "L'Oreal",
      "Colorbar",
      "Biotique",
      "Himalaya",
      "Garnier",
      "Nivea",
    ],
    Myntra: [
      "Lakme",
      "Maybelline",
      "MAC",
      "Nykaa",
      "Sugar",
      "Colorbar",
      "L'Oreal",
      "Faces Canada",
    ],
  },
  Lifestyle: {
    Amazon: [
      "Titan",
      "Casio",
      "Fossil",
      "Tommy Hilfiger",
      "Fastrack",
      "Daniel Klein",
      "Timex",
      "Sonata",
    ],
    Flipkart: [
      "Fastrack",
      "Sonata",
      "Titan",
      "Casio",
      "Timex",
      "Maxima",
      "HMT",
      "Fiesta",
    ],
    Myntra: [
      "Fossil",
      "Tommy Hilfiger",
      "Titan",
      "Fastrack",
      "Daniel Klein",
      "Michael Kors",
      "DKNY",
      "Casio",
    ],
  },
};

// Helper function to get random item from array
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get variants for a category
export const getVariants = (category = "Electronics") => {
  return PRODUCT_VARIANTS[category] || PRODUCT_VARIANTS.Electronics;
};

// Helper function to get specs for a category
export const getSpecs = (category = "Electronics") => {
  return PRODUCT_SPECS[category] || PRODUCT_SPECS.Electronics;
};

// Helper function to get brands for a store and category
export const getBrands = (storeName, category = "Electronics") => {
  const storeKey =
    storeName === "Amazon"
      ? "Amazon"
      : storeName === "Flipkart"
      ? "Flipkart"
      : "Myntra";
  return (
    PRODUCT_BRANDS[category]?.[storeKey] || PRODUCT_BRANDS.Electronics.Amazon
  );
};

// Helper function to determine category from query
export const determineCategoryFromQuery = (query) => {
  const q = query.toLowerCase();

  // Electronics keywords
  if (
    q.includes("laptop") ||
    q.includes("phone") ||
    q.includes("tablet") ||
    q.includes("headphone") ||
    q.includes("earphone") ||
    q.includes("speaker") ||
    q.includes("camera") ||
    q.includes("tv") ||
    q.includes("monitor")
  ) {
    return "Electronics";
  }

  // Fashion keywords
  if (
    q.includes("shirt") ||
    q.includes("jean") ||
    q.includes("shoe") ||
    q.includes("jacket") ||
    q.includes("dress") ||
    q.includes("pant") ||
    q.includes("trouser") ||
    q.includes("tshirt") ||
    q.includes("top")
  ) {
    return "Fashion";
  }

  // Grocery keywords
  if (
    q.includes("rice") ||
    q.includes("oil") ||
    q.includes("sugar") ||
    q.includes("flour") ||
    q.includes("atta") ||
    q.includes("dal") ||
    q.includes("masala") ||
    q.includes("spice")
  ) {
    return "Grocery";
  }

  // Beauty keywords
  if (
    q.includes("lipstick") ||
    q.includes("perfume") ||
    q.includes("cream") ||
    q.includes("shampoo") ||
    q.includes("makeup") ||
    q.includes("cosmetic") ||
    q.includes("serum") ||
    q.includes("moisturizer")
  ) {
    return "Beauty";
  }

  // Lifestyle keywords
  if (
    q.includes("watch") ||
    q.includes("bag") ||
    q.includes("sunglass") ||
    q.includes("wallet") ||
    q.includes("belt") ||
    q.includes("accessory")
  ) {
    return "Lifestyle";
  }

  // Default to Electronics
  return "Electronics";
};
