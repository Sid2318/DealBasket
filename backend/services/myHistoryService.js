import MyHistory from "../models/MyHistory.js";

export const savePurchaseService = async (userId, purchaseData) => {
  const {
    productId,
    productName,
    productImage,
    website,
    category,
    subcategory,
    originalPrice,
    finalPrice,
    savedAmount,
    discount,
  } = purchaseData;

  // Validate required fields
  if (
    !productId ||
    !productName ||
    !website ||
    originalPrice === undefined ||
    finalPrice === undefined
  ) {
    throw new Error("Missing required fields");
  }

  const purchase = await MyHistory.create({
    userId,
    productId,
    productName,
    productImage,
    website,
    category,
    subcategory,
    originalPrice,
    finalPrice,
    savedAmount,
    discount,
  });

  return {
    message: "Purchase saved successfully",
    purchase,
  };
};

export const getMyHistoryService = async (userId) => {
  const history = await MyHistory.find({ userId }).sort({ purchasedAt: -1 });
  return history;
};

export const getTotalSavingsService = async (userId) => {
  const history = await MyHistory.find({ userId });

  const totalSavings = history.reduce(
    (total, item) => total + item.savedAmount,
    0,
  );
  const totalSpent = history.reduce(
    (total, item) => total + item.finalPrice,
    0,
  );
  const totalPurchases = history.length;
  const averageSavings = totalPurchases > 0 ? totalSavings / totalPurchases : 0;

  return {
    totalSavings,
    totalSpent,
    totalPurchases,
    averageSavings: Math.round(averageSavings),
  };
};
