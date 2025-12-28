import mongoose from "mongoose";

const scrapedProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    productUrl: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    scraperType: {
      type: String,
      enum: ["home", "category", "product"],
      default: "home",
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
scrapedProductSchema.index({ category: 1, scraperType: 1 });
scrapedProductSchema.index({ scrapedAt: -1 });

export default mongoose.model("ScrapedProduct", scrapedProductSchema);
