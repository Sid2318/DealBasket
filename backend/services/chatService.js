import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import Seller from "../models/Seller.js";

const buildConversationKey = (userA, userB) => {
  return [userA.toString(), userB.toString()].sort().join("_");
};

const toObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid ID");
  }
  return new mongoose.Types.ObjectId(value);
};

const mapConversationForUser = (
  conversation,
  currentUserId,
  sellerByUserId,
) => {
  const currentId = currentUserId.toString();
  const participants = (conversation.participants || []).map((participant) => {
    const participantId = participant._id.toString();
    const seller = sellerByUserId.get(participantId);

    return {
      _id: participant._id,
      name: participant.name,
      email: participant.email,
      role: participant.role,
      sellerProfile: seller
        ? {
            sellerId: seller._id,
            shopName: seller.shopName,
            isVerified: seller.isVerified,
          }
        : null,
    };
  });

  const otherParticipant =
    participants.find((p) => p._id.toString() !== currentId) || null;

  return {
    _id: conversation._id,
    sellerId: conversation.sellerId || null,
    participants,
    otherParticipant,
    lastMessage: conversation.lastMessage || null,
    updatedAt: conversation.updatedAt,
    createdAt: conversation.createdAt,
  };
};

const hydrateConversations = async (conversations, currentUserId) => {
  const userIds = new Set();

  conversations.forEach((conversation) => {
    (conversation.participants || []).forEach((participant) => {
      const participantId =
        participant._id?.toString?.() || participant.toString();
      userIds.add(participantId);
    });
  });

  const sellers = await Seller.find({
    userId: {
      $in: Array.from(userIds).map((id) => new mongoose.Types.ObjectId(id)),
    },
  })
    .select("_id userId shopName isVerified")
    .lean();

  const sellerByUserId = new Map(
    sellers.map((seller) => [seller.userId.toString(), seller]),
  );

  return conversations.map((conversation) =>
    mapConversationForUser(conversation, currentUserId, sellerByUserId),
  );
};

const ensureParticipant = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Not authorized for this conversation");
  }

  return conversation;
};

export const startConversationService = async (currentUserId, sellerId) => {
  const sellerObjectId = toObjectId(sellerId);
  const seller = await Seller.findById(sellerObjectId).select("_id userId");

  if (!seller) {
    throw new Error("Seller not found");
  }

  if (seller.userId.toString() === currentUserId.toString()) {
    throw new Error("Cannot start chat with your own shop");
  }

  const conversationKey = buildConversationKey(currentUserId, seller.userId);

  let conversation = await Conversation.findOne({ conversationKey }).populate(
    "participants",
    "name email role",
  );

  if (!conversation) {
    conversation = await Conversation.create({
      conversationKey,
      participants: [currentUserId, seller.userId],
      sellerId: seller._id,
      startedBy: currentUserId,
    });

    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "name email role",
    );
  }

  const hydrated = await hydrateConversations([conversation], currentUserId);
  return hydrated[0];
};

export const getMyConversationsService = async (currentUserId) => {
  const userObjectId = toObjectId(currentUserId);

  const conversations = await Conversation.find({ participants: userObjectId })
    .populate("participants", "name email role")
    .sort({ updatedAt: -1 })
    .lean();

  return hydrateConversations(conversations, currentUserId);
};

export const getConversationMessagesService = async (
  currentUserId,
  conversationId,
) => {
  const validatedConversationId = toObjectId(conversationId);
  await ensureParticipant(validatedConversationId, currentUserId);

  const messages = await ChatMessage.find({
    conversationId: validatedConversationId,
  })
    .populate("senderId", "name role")
    .populate("receiverId", "name role")
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

export const sendMessageService = async (
  currentUserId,
  conversationId,
  text,
) => {
  const messageText = (text || "").trim();
  if (!messageText) {
    throw new Error("Message cannot be empty");
  }

  const conversation = await ensureParticipant(conversationId, currentUserId);

  const receiverId = conversation.participants.find(
    (participantId) => participantId.toString() !== currentUserId.toString(),
  );

  if (!receiverId) {
    throw new Error("Conversation recipient not found");
  }

  const message = await ChatMessage.create({
    conversationId: conversation._id,
    senderId: currentUserId,
    receiverId,
    text: messageText,
  });

  conversation.lastMessage = {
    text: message.text,
    senderId: currentUserId,
    createdAt: message.createdAt,
  };
  await conversation.save();

  return ChatMessage.findById(message._id)
    .populate("senderId", "name role")
    .populate("receiverId", "name role")
    .lean();
};
