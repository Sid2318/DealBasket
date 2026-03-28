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
import { scheduleAggregateScraper } from "./services/scraperService.js";
import logger from "./utils/logger.js";
import {
  setupPerformanceMiddleware,
  compressResponse,
} from "./middlewares/performanceMiddleware.js";

dotenv.config();

const app = express();

// CORS configuration for secure cookie handling
const isDev = process.env.NODE_ENV !== "production";
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (isDev && isLocalhost) {
      return callback(null, true);
    }

    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
  exposedHeaders: ["set-cookie"],
};

logger.info("🌍 Configuring CORS", {
  origin: corsOptions.origin,
  credentials: corsOptions.credentials,
});

app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  logger.info("📝 Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info("📤 Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
});

// Cookie parser middleware (must be before routes)
logger.debug("🍪 Setting up cookie parser middleware");
app.use(cookieParser());

// Setup performance middleware
logger.debug("⚡ Setting up performance middleware");
setupPerformanceMiddleware(app);

// Compress responses
logger.debug("📦 Setting up response compression");
app.use(compressResponse);

// Increase payload limit for better performance
logger.debug("📋 Configuring JSON and URL-encoded parsers", {
  limit: "10mb",
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and run scraper
const startServer = async () => {
  try {
    logger.info("🚀 Starting DealBasket server...");

    logger.info("📁 Connecting to MongoDB database...");
    await connectDB();
    logger.info("✅ Database connection established successfully");

    // Routes
    logger.info("🛫 Registering API routes...");

    logger.debug("🔐 Registering auth routes at /auth");
    app.use("/auth", authRoutes);

    logger.debug("📦 Registering product routes at /products");
    app.use("/products", productRoutes);

    logger.debug("📜 Registering history routes at /myhistory");
    app.use("/myhistory", myHistoryRoutes);

    logger.debug("🏢 Registering seller routes at /seller");
    app.use("/seller", sellerRoutes);

    logger.info("✅ All routes registered successfully");

    app.listen(PORT, () => {
      logger.info("🎉 ================================");
      logger.info("🎉 Server started successfully!");
      logger.info(`🎉 Server running on http://localhost:${PORT}`);
      logger.info("🎉 Environment:", process.env.NODE_ENV || "development");
      logger.info(
        "🎉 Frontend URL:",
        process.env.FRONTEND_URL || "http://localhost:5173",
      );
      logger.info("🎉 ================================");

      // Run aggregate scraper on a 2-day schedule after server starts
      logger.info("\n⏳ Scheduling background scraper (every 2 days)...\n");
      scheduleAggregateScraper().catch((err) =>
        logger.error("❌ Scraper scheduler error:", { error: err.message }),
      );
    });
  } catch (error) {
    logger.error("🚨 ================================");
    logger.error("🚨 CRITICAL: Server startup failed!");
    logger.error("🚨 Error:", error.message);
    logger.error("🚨 Stack:", error.stack);
    logger.error("🚨 ================================");
    process.exit(1);
  }
};

logger.info("🚀 Initializing DealBasket application...");
startServer();
