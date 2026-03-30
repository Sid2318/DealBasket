import express from "express";
import {
  getConversationMessages,
  getMyConversations,
  sendMessage,
  startConversation,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getMyConversations);
router.post("/conversations/start", startConversation);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.post("/conversations/:conversationId/messages", sendMessage);

export default router;
