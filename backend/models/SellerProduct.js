import mongoose from "mongoose";

const sellerProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
      default: "Seller", // Mark as seller product
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
      type: String, // Can be seller's product page or contact link
    },
  },
  { timestamps: true }
);

const SellerProduct = mongoose.model("SellerProduct", sellerProductSchema);

export default SellerProduct;
