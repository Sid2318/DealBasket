import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    website: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
