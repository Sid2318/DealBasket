import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";  

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});