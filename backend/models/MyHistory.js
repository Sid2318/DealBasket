import mongoose from "mongoose";

const myHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "guest",
    },
    idempotencyKey: {
      type: String,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
    },
    website: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

myHistorySchema.index(
  { userId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: "string" } },
  },
);

export default mongoose.model("MyHistory", myHistorySchema);
