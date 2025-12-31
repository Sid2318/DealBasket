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
      required: true,
    },
    quantity: {
      type: String,
    },
    actualPrice: {
      type: String,
      required: true,
    },
    discountedPrice: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    details: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
