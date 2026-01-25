import {
  getSellerShopService,
  getAllProductsService,
  getProductsBySubcategoryService,
  getAllCategoriesService,
  getProductByIdService,
  createProductService,
  seedProductsService,
} from "../services/productService.js";

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
  try {
    const idErrors = validateMongoId(req.params.sellerId, "seller");
    if (idErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: idErrors,
      });
    }

    const seller = await getSellerShopService(req.params.sellerId);
    res.json(seller);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pagination = { page: parseInt(page), limit: parseInt(limit) };
    const products = await getAllProductsService(req.query, pagination);
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

export const getProductsBySubcategory = async (req, res) => {
  try {
    const products = await getProductsBySubcategoryService(
      req.params.subcategory,
    );
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
