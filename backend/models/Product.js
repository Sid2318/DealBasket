import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
