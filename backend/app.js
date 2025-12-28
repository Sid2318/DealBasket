import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import myHistoryRoutes from "./routes/myHistoryRoutes.js";
import scrapingRoutes from "./routes/scrapingRoutes.js";
import connectDB from "./config/db.js";
import { initializeCronJobs } from "./scrapers/cronScraper.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize cron jobs for scraping
initializeCronJobs();

// Routes
app.use("/auth", authRoutes);
app.use("/myhistory", myHistoryRoutes);
app.use("/api/scrape", scrapingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
