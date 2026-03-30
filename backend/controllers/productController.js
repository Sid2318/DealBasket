import {
  getSellerShopService,
  getAllProductsService,
  getProductsBySubcategoryService,
  getAllCategoriesService,
  getProductByIdService,
  createProductService,
  seedProductsService,
  searchProductsService,
} from "../services/productService.js";
import logger from "../utils/logger.js";

const validateMongoId = (id, fieldName) => {
  const mongoIdPattern = /^[a-f\d]{24}$/i;
  if (!id || !mongoIdPattern.test(id)) {
    return [`Valid ${fieldName} ID required`];
  }
  return [];
};

const validateProductCreation = (data) => {
  const { name, category } = data;
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Product name is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  return errors;
};

export const getSellerShop = async (req, res) => {
  const { sellerId } = req.params;
  logger.info("🏢 Getting seller shop details", {
    sellerId,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    logger.debug("📝 Validating seller ID", { sellerId });
    const idErrors = validateMongoId(req.params.sellerId, "seller");
    if (idErrors.length > 0) {
      logger.warn("❌ Invalid seller ID provided", {
        sellerId,
        errors: idErrors,
      });
      return res.status(400).json({
        message: "Validation failed",
        errors: idErrors,
      });
    }

    logger.info("🔍 Fetching seller shop data", { sellerId });
    const seller = await getSellerShopService(req.params.sellerId);

    logger.info("✅ Seller shop retrieved successfully", {
      sellerId,
      shopName: seller?.shopName,
      productsCount: seller?.products?.length || 0,
    });
    res.json(seller);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  logger.info("📋 Getting all products", {
    query: req.query,
    ip: req.ip,
  });

  try {
    const { page = 1, limit = 20 } = req.query;
    const pagination = { page: parseInt(page), limit: parseInt(limit) };

    logger.debug("📊 Processing product request with pagination", {
      pagination,
      filters: req.query,
    });

    const products = await getAllProductsService(req.query, pagination);

    logger.info("✅ Products retrieved successfully", {
      count: products.length,
      page: pagination.page,
      limit: pagination.limit,
      hasMore: products.length === pagination.limit,
    });

    res.json({
      products,
      currentPage: pagination.page,
      limit: pagination.limit,
      hasMore: products.length === pagination.limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  logger.info("🔎 Product search request", {
    query: req.query,
    ip: req.ip,
  });

  try {
    const { q = "", page = 1, limit = 20 } = req.query;
    const result = await searchProductsService(q, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error("❌ Product search failed", {
      error: error.message,
    });
    res.status(500).json({ message: "Search failed" });
  }
};

export const getProductsBySubcategory = async (req, res) => {
  const { subcategory } = req.params;
  logger.info("📎 Getting products by subcategory", {
    subcategory,
    ip: req.ip,
  });

  try {
    logger.debug("🔍 Fetching products for subcategory", { subcategory });
    const products = await getProductsBySubcategoryService(subcategory);

    logger.info("✅ Subcategory products retrieved successfully", {
      subcategory,
      count: products.length,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const idErrors = validateMongoId(req.params.id, "product");
    if (idErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: idErrors,
      });
    }

    const product = await getProductByIdService(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.message === "Product not found in both collections") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const validationErrors = validateProductCreation(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const seedProducts = async (req, res) => {
  try {
    const result = await seedProductsService();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
