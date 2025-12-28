import express from "express";
import { comparePrices } from "../controllers/priceController.js";

const router = express.Router();

router.get("/compare/:productId", comparePrices);

export default router;
