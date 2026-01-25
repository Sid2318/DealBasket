import compression from "compression";
import cors from "cors";

// Performance optimization middleware
export const setupPerformanceMiddleware = (app) => {
  // Enable gzip compression
  app.use(
    compression({
      level: 6,
      threshold: 1024, // Only compress responses larger than 1KB
    }),
  );

  // Optimized CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || [
        "http://localhost:5173",
        "http://localhost:3000",
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );

  // Set cache headers for static assets
  app.use((req, res, next) => {
    if (req.url.includes("/static/") || req.url.includes("/assets/")) {
      res.set("Cache-Control", "public, max-age=31536000"); // 1 year
    } else {
      res.set("Cache-Control", "no-cache");
    }
    next();
  });

  // Request timeout
  app.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds
    next();
  });
};

// Database connection optimization
export const dbOptimization = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

// Response compression for JSON
export const compressResponse = (req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    if (typeof data === "object") {
      // Remove unnecessary fields from large objects
      if (Array.isArray(data) && data.length > 50) {
        data = data.slice(0, 50); // Limit to 50 items initially
      }
    }
    oldSend.call(this, data);
  };
  next();
};
