import MyHistory from "../models/MyHistory.js";

// Save purchase to history
export const savePurchase = async (req, res) => {
  try {
    const {
      productId,
      productName,
      storeId,
      storeName,
      originalPrice,
      finalPrice,
      savedAmount,
    } = req.body;

    // Get userId from authenticated user (req.user is set by auth middleware)
    const userId = req.user?._id || "guest";

    const purchase = await MyHistory.create({
      userId,
      productId,
      productName,
      storeId,
      storeName,
      originalPrice,
      finalPrice,
      savedAmount,
    });

    res.status(201).json({
      message: "Purchase saved successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all purchase history for a user
export const getMyHistory = async (req, res) => {
  try {
    const userId = req.user?._id || "guest";

    const history = await MyHistory.find({ userId }).sort({ purchasedAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total savings for a user
export const getTotalSavings = async (req, res) => {
  try {
    const userId = req.user?._id || "guest";

    const history = await MyHistory.find({ userId });

    const totalSavings = history.reduce(
      (total, item) => total + item.savedAmount,
      0
    );
    const totalPurchases = history.length;
    const averageSavings =
      totalPurchases > 0 ? totalSavings / totalPurchases : 0;

    res.json({
      totalSavings,
      totalPurchases,
      averageSavings: Math.round(averageSavings),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
