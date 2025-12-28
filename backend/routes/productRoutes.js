import express from "express";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import Price from "../models/Price.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
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
