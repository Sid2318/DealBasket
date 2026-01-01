import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import myHistoryRoutes from "./routes/myHistoryRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import connectDB from "./config/db.js";
import { runAggregateScraperAndStore } from "./services/scraperService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

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
      console.log(`🚀 Server running on http://localhost:${PORT}`);

      // Run aggregate scraper in background after server starts
      // console.log("\n🔄 Starting background scraper...\n");
      // runAggregateScraperAndStore()
      //   .then(() =>
      //     console.log("✅ Background scraper completed successfully\n")
      //   )
      //   .catch((err) => console.error("❌ Background scraper error:", err));
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
