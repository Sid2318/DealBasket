import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    logger.info("🔄 Establishing MongoDB connection...");
    logger.debug(
      "🔗 MongoDB URI:",
      process.env.MONGO_URI ? "URI configured" : "URI not found",
    );

    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info("✅ MongoDB Connected successfully!", {
      host: conn.connection.host,
      port: conn.connection.port,
      database: conn.connection.name,
      readyState: conn.connection.readyState,
    });

    // Setup connection event listeners
    mongoose.connection.on("connected", () => {
      logger.info("🔗 Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("❌ Mongoose connection error:", { error: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ Mongoose disconnected from MongoDB");
    });
  } catch (err) {
    logger.error("🚨 MongoDB connection failed!", {
      error: err.message,
      stack: err.stack,
      code: err.code,
    });
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
