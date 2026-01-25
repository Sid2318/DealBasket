import Seller from "../models/Seller.js";
import User from "../models/User.js";
import SellerProduct from "../models/SellerProduct.js";
import MyHistory from "../models/MyHistory.js";

export const registerSellerService = async (userId, sellerData) => {
  // Check if already a seller
  const existingSeller = await Seller.findOne({ userId });
  if (existingSeller) {
    throw new Error("Already registered as seller");
  }

  const {
    shopName,
    shopDescription,
    contactNumber,
    address,
    businessType,
    gstNumber,
  } = sellerData;

  const seller = await Seller.create({
    userId,
    shopName,
    shopDescription,
    contactNumber,
    address,
    businessType,
    gstNumber,
  });

  // Update user role to seller
  await User.findByIdAndUpdate(userId, { role: "seller" });

  return {
    message: "Seller registration successful",
    seller,
  };
};

export const getSellerProfileService = async (userId) => {
  const seller = await Seller.findOne({ userId }).populate(
    "userId",
    "name email",
  );

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};

export const updateSellerProfileService = async (userId, updateData) => {
  const seller = await Seller.findOneAndUpdate({ userId }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!seller) {
    throw new Error("Seller not found");
  }

  return { message: "Profile updated", seller };
};

export const addProductService = async (userId, productData) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const product = await SellerProduct.create({
    sellerId: seller._id,
    ...productData,
    website: seller.shopName || "Seller",
  });

  return { message: "Product added successfully", product };
};

export const getSellerProductsService = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const products = await SellerProduct.find({ sellerId: seller._id }).sort({
    createdAt: -1,
  });

  return products;
};

export const updateProductService = async (userId, productId, updateData) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const product = await SellerProduct.findOneAndUpdate(
    { _id: productId, sellerId: seller._id },
    updateData,
    { new: true, runValidators: true },
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return { message: "Product updated", product };
};

export const deleteProductService = async (userId, productId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const product = await SellerProduct.findOneAndDelete({
    _id: productId,
    sellerId: seller._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return { message: "Product deleted successfully" };
};

export const getSellerStatsService = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const products = await SellerProduct.find({ sellerId: seller._id });
  const totalProducts = products.length;

  // Calculate total revenue from products
  const totalRevenue = products.reduce((sum, product) => {
    return (
      sum + parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "") || 0)
    );
  }, 0);

  // Top products by name
  const topProducts = products.slice(0, 5).map((p) => ({
    name: p.name,
    actualPrice: p.actualPrice,
    discountedPrice: p.discountedPrice,
    discount: p.discount,
  }));

  return {
    totalProducts,
    totalRevenue: Math.round(totalRevenue),
    topProducts,
    shopName: seller.shopName,
    isVerified: seller.isVerified,
  };
};

export const getSellerSalesStatsService = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  // Get all products of this seller
  const products = await SellerProduct.find({ sellerId: seller._id });
  const productIdToName = {};
  products.forEach((p) => {
    productIdToName[p._id.toString()] = p.name;
  });

  // Get all sales (purchases) for these products
  const productIds = Object.keys(productIdToName);
  const sales = await MyHistory.find({
    productId: { $in: productIds },
  }).lean();

  // Get all userIds from sales except 'guest'
  const userIds = Array.from(
    new Set(sales.map((s) => s.userId).filter((uid) => uid !== "guest")),
  );
  let userMap = {};
  if (userIds.length > 0) {
    const users = await User.find({ _id: { $in: userIds } })
      .select("email _id")
      .lean();
    users.forEach((u) => {
      userMap[u._id.toString()] = u.email;
    });
  }

  // Aggregate sales per product
  const productSales = {};
  let totalSold = 0;
  let totalEarned = 0;
  sales.forEach((sale) => {
    const pid = sale.productId;
    if (!productSales[pid]) {
      productSales[pid] = {
        name: productIdToName[pid],
        count: 0,
        earned: 0,
        buyers: [],
      };
    }
    productSales[pid].count += 1;
    productSales[pid].earned += sale.finalPrice;
    // Push buyer email if available, else 'guest'
    if (sale.userId === "guest") {
      productSales[pid].buyers.push("guest");
    } else {
      productSales[pid].buyers.push({
        email: userMap[sale.userId] || sale.userId,
      });
    }
    totalSold += 1;
    totalEarned += sale.finalPrice;
  });

  return {
    productSales: Object.values(productSales),
    totalSold,
    totalEarned,
  };
};
