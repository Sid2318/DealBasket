import express from "express";
import Product from "../models/Product.js";
import SellerProduct from "../models/SellerProduct.js";
import Seller from "../models/Seller.js";

const router = express.Router();

// Get seller shop details by sellerId
router.get("/shop/:sellerId", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (scraped + seller products)
router.get("/", async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Fetch both scraped products and seller products
    const scrapedProducts = await Product.find(filter);
    const sellerProducts = await SellerProduct.find(filter);

    // Combine both arrays
    const allProducts = [...scrapedProducts, ...sellerProducts];

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by subcategory (scraped + seller products)
router.get("/subcategory/:subcategory", async (req, res) => {
  try {
    const scrapedProducts = await Product.find({
      subcategory: req.params.subcategory,
    });

    const sellerProducts = await SellerProduct.find({
      subcategory: req.params.subcategory,
    }).populate("sellerId", "shopName");

    // Combine both arrays
    // Attach shopName to seller products for frontend
    const sellerProductsWithShop = sellerProducts.map((p) => ({
      ...p.toObject(),
      shopName: p.sellerId?.shopName || undefined,
    }));
    const allProducts = [...scrapedProducts, ...sellerProductsWithShop];

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories with subcategories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          subcategories: { $addToSet: "$subcategory" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product (check both Product and SellerProduct)
router.get("/:id", async (req, res) => {
  try {
    // console.log("Searching for product with ID:", req.params.id);

    let product = await Product.findById(req.params.id);
    // console.log("Product collection search result:", product);

    // If not found in Product, try SellerProduct
    if (!product) {
      product = await SellerProduct.findById(req.params.id).populate(
        "sellerId",
        "shopName contactNumber address shopDescription"
      );
      // console.log("SellerProduct collection search result:", product);

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found in both collections" });
      }
    }

    res.json(product);
  } catch (error) {
    // console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create product (for testing)
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Seed data (for testing) - Add sample products, stores, and prices
router.post("/seed", async (req, res) => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Store.deleteMany({});
    await Price.deleteMany({});

    // Create stores
    const amazon = await Store.create({
      name: "Amazon",
      website: "https://amazon.in",
    });
    const flipkart = await Store.create({
      name: "Flipkart",
      website: "https://flipkart.com",
    });
    const myntra = await Store.create({
      name: "Myntra",
      website: "https://myntra.com",
    });

    // Create products
    const laptop = await Product.create({
      name: "Dell Laptop",
      category: "Electronics",
      image: "https://via.placeholder.com/200",
    });

    const phone = await Product.create({
      name: "Samsung Phone",
      category: "Electronics",
      image: "https://via.placeholder.com/200",
    });

    const shirt = await Product.create({
      name: "Casual Shirt",
      category: "Clothing",
      image: "https://via.placeholder.com/200",
    });

    // Create prices for laptop
    await Price.create([
      {
        productId: laptop._id,
        storeId: amazon._id,
        originalPrice: 50000,
        discountedPrice: 45000,
      },
      {
        productId: laptop._id,
        storeId: flipkart._id,
        originalPrice: 50000,
        discountedPrice: 43000,
      },
    ]);

    // Create prices for phone
    await Price.create([
      {
        productId: phone._id,
        storeId: amazon._id,
        originalPrice: 20000,
        discountedPrice: 18000,
      },
      {
        productId: phone._id,
        storeId: flipkart._id,
        originalPrice: 20000,
        discountedPrice: 17500,
      },
      {
        productId: phone._id,
        storeId: myntra._id,
        originalPrice: 20000,
        discountedPrice: 19000,
      },
    ]);

    // Create prices for shirt
    await Price.create([
      {
        productId: shirt._id,
        storeId: myntra._id,
        originalPrice: 1500,
        discountedPrice: 1200,
      },
      {
        productId: shirt._id,
        storeId: flipkart._id,
        originalPrice: 1500,
        discountedPrice: 1100,
      },
    ]);

    res.json({ message: "Seed data created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
