import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Connected: ✅");
  } catch (err) {
    logger.error("MongoDB connection error:", { error: err.message });
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
