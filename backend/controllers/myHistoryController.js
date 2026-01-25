import {
  savePurchaseService,
  getMyHistoryService,
  getTotalSavingsService,
} from "../services/myHistoryService.js";
import logger from "../utils/logger.js";

export const savePurchase = async (req, res) => {
  try {
    // Require authentication for purchase
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "You must be logged in to make a purchase." });
    }

    const result = await savePurchaseService(req.user._id, req.body);
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
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "You must be logged in to view your history." });
    }

    const { page = 1, limit = 10 } = req.query;
    const pagination = { page: parseInt(page), limit: parseInt(limit) };
    const history = await getMyHistoryService(req.user._id, pagination);
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
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "You must be logged in to view your savings." });
    }

    const savings = await getTotalSavingsService(req.user._id);
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
