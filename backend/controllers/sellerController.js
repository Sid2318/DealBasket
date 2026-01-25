import {
  registerSellerService,
  getSellerProfileService,
  updateSellerProfileService,
  addProductService,
  getSellerProductsService,
  updateProductService,
  deleteProductService,
  getSellerStatsService,
  getSellerSalesStatsService,
} from "../services/sellerService.js";

const validateSellerRegistration = (data) => {
  const { shopName, contactNumber } = data;
  const errors = [];

  if (!shopName || shopName.trim() === "") {
    errors.push("Shop name is required");
  }

  if (!contactNumber || contactNumber.trim() === "") {
    errors.push("Contact number is required");
  }

  return errors;
};

const validateProductData = (data, isUpdate = false) => {
  const { name, actualPrice, discountedPrice, category } = data;
  const errors = [];

  if (!isUpdate || name !== undefined) {
    if (!name || name.trim() === "") {
      errors.push("Product name is required");
    }
  }

  if (!isUpdate || actualPrice !== undefined) {
    if (!actualPrice || isNaN(actualPrice) || Number(actualPrice) <= 0) {
      errors.push("Valid actual price is required");
    }
  }

  if (!isUpdate || discountedPrice !== undefined) {
    if (
      !discountedPrice ||
      isNaN(discountedPrice) ||
      Number(discountedPrice) <= 0
    ) {
      errors.push("Valid discounted price is required");
    }
  }

  if (!isUpdate || category !== undefined) {
    if (!category || category.trim() === "") {
      errors.push("Category is required");
    }
  }

  return errors;
};

const validateMongoId = (id, fieldName) => {
  const mongoIdPattern = /^[a-f\d]{24}$/i;
  if (!id || !mongoIdPattern.test(id)) {
    return [`Valid ${fieldName} ID required`];
  }
  return [];
};

export const registerSeller = async (req, res) => {
  try {
    const validationErrors = validateSellerRegistration(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const result = await registerSellerService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Already registered as seller") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSellerProfile = async (req, res) => {
  try {
    const seller = await getSellerProfileService(req.user._id);
    res.status(200).json(seller);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const result = await updateSellerProfileService(req.user._id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const validationErrors = validateProductData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const result = await addProductService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await getSellerProductsService(req.user._id);
    res.status(200).json(products);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productIdErrors = validateMongoId(req.params.productId, "product");
    if (productIdErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: productIdErrors,
      });
    }

    const validationErrors = validateProductData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const result = await updateProductService(
      req.user._id,
      req.params.productId,
      req.body,
    );
    res.status(200).json(result);
  } catch (error) {
    if (
      error.message === "Seller not found" ||
      error.message === "Product not found"
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productIdErrors = validateMongoId(req.params.productId, "product");
    if (productIdErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: productIdErrors,
      });
    }

    const result = await deleteProductService(
      req.user._id,
      req.params.productId,
    );
    res.status(200).json(result);
  } catch (error) {
    if (
      error.message === "Seller not found" ||
      error.message === "Product not found"
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    const stats = await getSellerStatsService(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSellerSalesStats = async (req, res) => {
  try {
    const stats = await getSellerSalesStatsService(req.user._id);
    res.json(stats);
  } catch (error) {
    if (error.message === "Seller not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
