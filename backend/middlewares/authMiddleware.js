import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

// Protect routes (JWT authentication)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      logger.error("Authentication token verification failed:", {
        error: error.message,
      });
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Export as named export
export const authMiddleware = protect;

// Do you have a pass? → Check header
// Is the pass real? → Verify JWT
// Who owns this pass? → Fetch user from DB
// All good? → Let them in (next())
// Anything wrong? → Deny entry (401)
