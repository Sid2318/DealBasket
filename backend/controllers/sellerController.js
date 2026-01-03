// Register as seller
export const registerSeller = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if already a seller
    const existingSeller = await Seller.findOne({ userId });
    if (existingSeller) {
      return res.status(400).json({ message: "Already registered as seller" });
    }

    const {
      shopName,
      shopDescription,
      contactNumber,
      address,
      businessType,
      gstNumber,
    } = req.body;

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

    res.status(201).json({
      message: "Seller registration successful",
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get seller profile
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email"
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import MyHistory from "../models/MyHistory.js";
import Seller from "../models/Seller.js";
import User from "../models/User.js";
import SellerProduct from "../models/SellerProduct.js";

// Register as seller
export const getSellerSalesStats = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Get all products of this seller
    const products = await SellerProduct.find({ sellerId: seller._id });
    const productIdToName = {};
    products.forEach((p) => {
      productIdToName[p._id.toString()] = p.name;
    });

    // Get all sales (purchases) for these products
    const productIds = Object.keys(productIdToName);
    // Populate user info for each sale
    const sales = await MyHistory.find({
      productId: { $in: productIds },
    }).lean();

    // Get all userIds from sales except 'guest'
    const userIds = Array.from(
      new Set(sales.map((s) => s.userId).filter((uid) => uid !== "guest"))
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

    res.json({
      productSales: Object.values(productSales),
      totalSold,
      totalEarned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update seller profile
export const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Profile updated", seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const product = await SellerProduct.create({
      sellerId: seller._id,
      ...req.body,
      website: seller.shopName || "Seller",
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller's products
export const getSellerProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const products = await SellerProduct.find({ sellerId: seller._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const seller = await Seller.findOne({ userId: req.user._id });

    const product = await SellerProduct.findOneAndUpdate(
      { _id: productId, sellerId: seller._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const seller = await Seller.findOne({ userId: req.user._id });

    const product = await SellerProduct.findOneAndDelete({
      _id: productId,
      sellerId: seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller stats
export const getSellerStats = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const products = await SellerProduct.find({ sellerId: seller._id });

    const totalProducts = products.length;

    // Calculate total revenue from products
    const totalRevenue = products.reduce((sum, product) => {
      return (
        sum + parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "") || 0)
      );
    }, 0);

    // Top products by name (since we don't have sales data)
    const topProducts = products.slice(0, 5).map((p) => ({
      name: p.name,
      actualPrice: p.actualPrice,
      discountedPrice: p.discountedPrice,
      discount: p.discount,
    }));

    res.status(200).json({
      totalProducts,
      totalRevenue: Math.round(totalRevenue),
      topProducts,
      shopName: seller.shopName,
      isVerified: seller.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
