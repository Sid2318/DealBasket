import Product from "../models/Product.js";
import SellerProduct from "../models/SellerProduct.js";
import Seller from "../models/Seller.js";

// Get seller shop details by sellerId
export const getSellerShop = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (scraped + seller products)
export const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }
    const scrapedProducts = await Product.find(filter);
    const sellerProducts = await SellerProduct.find(filter);
    const allProducts = [...scrapedProducts, ...sellerProducts];
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by subcategory (scraped + seller products)
export const getProductsBySubcategory = async (req, res) => {
  try {
    const scrapedProducts = await Product.find({
      subcategory: req.params.subcategory,
    });
    const sellerProducts = await SellerProduct.find({
      subcategory: req.params.subcategory,
    }).populate("sellerId", "shopName");
    const sellerProductsWithShop = sellerProducts.map((p) => ({
      ...p.toObject(),
      shopName: p.sellerId?.shopName || undefined,
    }));
    const allProducts = [...scrapedProducts, ...sellerProductsWithShop];
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories with subcategories
export const getAllCategories = async (req, res) => {
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
};

// Get single product (check both Product and SellerProduct)
export const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      product = await SellerProduct.findById(req.params.id).populate(
        "sellerId",
        "shopName contactNumber address shopDescription",
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found in both collections" });
      }
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (for testing)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

