import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    quantity: {
      type: String,
    },
    actualPrice: {
      type: String,
    },
    discountedPrice: {
      type: String,
    },
    discount: {
      type: String,
    },
    details: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
