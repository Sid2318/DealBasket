import { Server } from "socket.io";
import User from "../models/User.js";
import { verifyAccessToken } from "../services/authService.js";
import { sendMessageService } from "../services/chatService.js";
import Conversation from "../models/Conversation.js";
import logger from "../utils/logger.js";

const getSocketCorsOrigin = () => {
  const isDev = process.env.NODE_ENV !== "production";
  const frontendUrl = process.env.FRONTEND_URL;

  return (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (isDev && isLocalhost) {
      return callback(null, true);
    }

    if (frontendUrl && origin === frontendUrl) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for socket: ${origin}`));
  };
};

const conversationRoom = (conversationId) => `conversation:${conversationId}`;
const userRoom = (userId) => `user:${userId}`;

export const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: getSocketCorsOrigin(),
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Socket authentication failed"));
      }

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select(
        "_id name email role",
      );

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userRoom(userId));

    logger.info("Socket connected", { userId, socketId: socket.id });

    socket.on("chat:join", async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("chat:error", { message: "Conversation not found" });
          return;
        }

        const isParticipant = conversation.participants.some(
          (participantId) => participantId.toString() === userId,
        );

        if (!isParticipant) {
          socket.emit("chat:error", {
            message: "Not authorized for this conversation",
          });
          return;
        }

        socket.join(conversationRoom(conversationId));
      } catch (error) {
        socket.emit("chat:error", { message: "Failed to join chat" });
      }
    });

    socket.on("chat:send", async ({ conversationId, text }) => {
      try {
        const message = await sendMessageService(userId, conversationId, text);
        const room = conversationRoom(conversationId);

        io.to(room).emit("chat:new-message", {
          conversationId,
          message,
        });

        const receiverId = message.receiverId?._id?.toString?.();
        if (receiverId) {
          io.to(userRoom(receiverId)).emit("chat:conversation-updated", {
            conversationId,
            message,
          });
        }
      } catch (error) {
        socket.emit("chat:error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId, socketId: socket.id });
    });
  });

  return io;
};
