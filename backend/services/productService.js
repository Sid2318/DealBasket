import Product from "../models/Product.js";
import SellerProduct from "../models/SellerProduct.js";
import Seller from "../models/Seller.js";

export const getSellerShopService = async (sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new Error("Seller not found");
  }
  return seller;
};

export const getAllProductsService = async (filters) => {
  const { category, subcategory } = filters;
  const filter = {};
  if (category && category !== "all") {
    filter.category = category;
  }
  if (subcategory) {
    filter.subcategory = subcategory;
  }
  const scrapedProducts = await Product.find(filter);
  const sellerProducts = await SellerProduct.find(filter);
  return [...scrapedProducts, ...sellerProducts];
};

export const getProductsBySubcategoryService = async (subcategory) => {
  const scrapedProducts = await Product.find({ subcategory });
  const sellerProducts = await SellerProduct.find({ subcategory }).populate(
    "sellerId",
    "shopName",
  );

  const sellerProductsWithShop = sellerProducts.map((p) => ({
    ...p.toObject(),
    shopName: p.sellerId?.shopName || undefined,
  }));

  return [...scrapedProducts, ...sellerProductsWithShop];
};

export const getAllCategoriesService = async () => {
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
  return categories;
};

export const getProductByIdService = async (productId) => {
  let product = await Product.findById(productId);
  if (!product) {
    product = await SellerProduct.findById(productId).populate(
      "sellerId",
      "shopName contactNumber address shopDescription",
    );
    if (!product) {
      throw new Error("Product not found in both collections");
    }
  }
  return product;
};

export const createProductService = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const seedProductsService = async () => {
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

  // Create prices for products
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

  return { message: "Seed data created successfully" };
};
