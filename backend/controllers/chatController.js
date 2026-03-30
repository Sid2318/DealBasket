import {
  getConversationMessagesService,
  getMyConversationsService,
  sendMessageService,
  startConversationService,
} from "../services/chatService.js";

export const startConversation = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const conversation = await startConversationService(req.user._id, sellerId);
    res.status(200).json({ conversation });
  } catch (error) {
    const statusCode =
      error.message === "Seller not found"
        ? 404
        : error.message === "Cannot start chat with your own shop"
          ? 400
          : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await getMyConversationsService(req.user._id);
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await getConversationMessagesService(
      req.user._id,
      conversationId,
    );
    res.status(200).json({ messages });
  } catch (error) {
    const statusCode =
      error.message === "Conversation not found"
        ? 404
        : error.message === "Not authorized for this conversation"
          ? 403
          : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    const message = await sendMessageService(
      req.user._id,
      conversationId,
      text,
    );
    res.status(201).json({ message });
  } catch (error) {
    const statusCode =
      error.message === "Conversation not found"
        ? 404
        : error.message === "Not authorized for this conversation"
          ? 403
          : error.message === "Message cannot be empty"
            ? 400
            : 500;

    res.status(statusCode).json({ message: error.message });
  }
};
