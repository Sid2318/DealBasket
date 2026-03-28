import MyHistory from "../models/MyHistory.js";

export const savePurchaseService = async (
  userId,
  purchaseData,
  idempotencyKey = null,
) => {
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

  if (idempotencyKey) {
    const existing = await MyHistory.findOne({ userId, idempotencyKey });
    if (existing) {
      return {
        message: "Purchase already saved",
        purchase: existing,
        idempotent: true,
      };
    }
  }

  let purchase;
  try {
    purchase = await MyHistory.create({
      userId,
      idempotencyKey,
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
  } catch (error) {
    if (error?.code === 11000 && idempotencyKey) {
      const existing = await MyHistory.findOne({ userId, idempotencyKey });
      if (existing) {
        return {
          message: "Purchase already saved",
          purchase: existing,
          idempotent: true,
        };
      }
    }
    throw error;
  }

  return {
    message: "Purchase saved successfully",
    purchase,
  };
};

export const getMyHistoryService = async (userId, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const history = await MyHistory.find({ userId })
    .sort({ purchasedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
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
