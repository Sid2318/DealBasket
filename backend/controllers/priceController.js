import Price from "../models/Price.js";

export const comparePrices = async (req, res) => {
  try {
    const { productId } = req.params;

    const prices = await Price.find({ productId })
      .populate("storeId", "name website")
      .sort({ discountedPrice: 1 });

    if (prices.length === 0) {
      return res.status(404).json({ message: "No prices found" });
    }

    res.json({
      bestDeal: prices[0],
      allPrices: prices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
