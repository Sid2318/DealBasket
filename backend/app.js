import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import myHistoryRoutes from "./routes/myHistoryRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import connectDB from "./config/db.js";
import { runAggregateScraperAndStore } from "./services/scraperService.js";
import logger from "./utils/logger.js";
import {
  setupPerformanceMiddleware,
  compressResponse,
} from "./middlewares/performanceMiddleware.js";

dotenv.config();

const app = express();

// CORS configuration for secure cookie handling
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// Cookie parser middleware (must be before routes)
app.use(cookieParser());

// Setup performance middleware
setupPerformanceMiddleware(app);

// Compress responses
app.use(compressResponse);

// Increase payload limit for better performance
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and run scraper
const startServer = async () => {
  try {
    await connectDB();

    // Routes
    app.use("/auth", authRoutes);
    app.use("/products", productRoutes);
    app.use("/myhistory", myHistoryRoutes);
    app.use("/seller", sellerRoutes);

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);

      // Run aggregate scraper in background after server starts
      // logger.info("\n🔄 Starting background scraper...\n");
      // runAggregateScraperAndStore()
      //   .then(() =>
      //     logger.info("✅ Background scraper completed successfully\n")
      //   )
      //   .catch((err) => logger.error("❌ Background scraper error:", { error: err.message }));
    });
  } catch (error) {
    logger.error("❌ Error starting server:", { error: error.message });
    process.exit(1);
  }
};

startServer();
