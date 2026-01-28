import {
  savePurchaseService,
  getMyHistoryService,
  getTotalSavingsService,
} from "../services/myHistoryService.js";
import logger from "../utils/logger.js";

export const savePurchase = async (req, res) => {
  logger.info("🛒 Purchase save attempt initiated", {
    userId: req.user?._id,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    // Require authentication for purchase
    if (!req.user || !req.user._id) {
      logger.warn("❌ Purchase save failed - user not authenticated", {
        ip: req.ip,
      });
      return res
        .status(401)
        .json({ message: "You must be logged in to make a purchase." });
    }

    logger.debug("📝 Processing purchase data", {
      userId: req.user._id,
      purchaseData: {
        productName: req.body.productName,
        website: req.body.website,
        category: req.body.category,
        finalPrice: req.body.finalPrice,
        savingsAmount: req.body.savingsAmount,
      },
    });

    const result = await savePurchaseService(req.user._id, req.body);

    logger.info("🎉 Purchase saved successfully", {
      userId: req.user._id,
      purchaseId: result.purchase?._id,
      productName: req.body.productName,
      finalPrice: req.body.finalPrice,
      savingsAmount: req.body.savingsAmount,
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Missing required fields") {
      return res.status(400).json({
        message: error.message,
        received: req.body,
      });
    }
    logger.error("Error in savePurchase:", {
      error: error.message,
      userId: req.user._id,
    });
    res.status(500).json({ message: error.message });
  }
};

export const getMyHistory = async (req, res) => {
  logger.info("📜 Getting user history", {
    userId: req.user?._id,
    query: req.query,
    ip: req.ip,
  });

  try {
    if (!req.user || !req.user._id) {
      logger.warn("❌ History access denied - user not authenticated", {
        ip: req.ip,
      });
      return res
        .status(401)
        .json({ message: "You must be logged in to view your history." });
    }

    const { page = 1, limit = 10 } = req.query;
    const pagination = { page: parseInt(page), limit: parseInt(limit) };

    logger.debug("📊 Processing history request with pagination", {
      userId: req.user._id,
      pagination,
    });

    const history = await getMyHistoryService(req.user._id, pagination);

    logger.info("✅ User history retrieved successfully", {
      userId: req.user._id,
      historyCount: history.length,
      page: pagination.page,
      limit: pagination.limit,
    });

    res.json({
      history,
      currentPage: pagination.page,
      limit: pagination.limit,
      hasMore: history.length === pagination.limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalSavings = async (req, res) => {
  logger.info("💰 Getting user total savings", {
    userId: req.user?._id,
    ip: req.ip,
  });

  try {
    if (!req.user || !req.user._id) {
      logger.warn("❌ Savings access denied - user not authenticated", {
        ip: req.ip,
      });
      return res
        .status(401)
        .json({ message: "You must be logged in to view your savings." });
    }

    logger.debug("🔢 Calculating total savings", {
      userId: req.user._id,
    });

    const savings = await getTotalSavingsService(req.user._id);

    logger.info("✅ Savings data retrieved successfully", {
      userId: req.user._id,
      totalSavings: savings.totalSavings,
      totalSpent: savings.totalSpent,
      totalPurchases: savings.totalPurchases,
      averageSavings: savings.averageSavings,
    });

    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
