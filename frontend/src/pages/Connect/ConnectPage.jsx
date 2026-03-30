import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getRegisteredShops } from "../../api/sellerApi";
import {
  getConversationMessages,
  getMyConversations,
  sendMessageHttp,
  startConversation,
} from "../../api/chatApi";
import { getAccessToken } from "../../api/authApi";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import "./ConnectPage.scss";

const formatAddress = (address = {}) => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Address not available";
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "S";
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

const getConversationTitle = (conversation) => {
  const other = conversation?.otherParticipant;
  if (!other) return "Unknown";
  return other.sellerProfile?.shopName || other.name;
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ConnectPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const activeConversationIdRef = useRef(null);

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [chatError, setChatError] = useState("");

  const selectedConversationId = selectedConversation?._id;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await getRegisteredShops();
        setShops(response.shops || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load registered shops.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const connectSocket = () => {
    const token = getAccessToken();
    if (!token || socketRef.current) {
      return;
    }

    const socketBaseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socket = io(socketBaseUrl, {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("chat:new-message", ({ conversationId, message }) => {
      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  lastMessage: {
                    text: message.text,
                    senderId: message.senderId?._id || message.senderId,
                    createdAt: message.createdAt,
                  },
                  updatedAt: message.createdAt,
                }
              : conversation,
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      );

      if (conversationId === activeConversationIdRef.current) {
        setMessages((prev) => {
          if (prev.some((existing) => existing._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    socket.on("chat:conversation-updated", ({ conversationId, message }) => {
      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  lastMessage: {
                    text: message.text,
                    senderId: message.senderId?._id || message.senderId,
                    createdAt: message.createdAt,
                  },
                  updatedAt: message.createdAt,
                }
              : conversation,
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      );

      if (conversationId === activeConversationIdRef.current) {
        setMessages((prev) => {
          if (prev.some((existing) => existing._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    socket.on("chat:error", ({ message }) => {
      setChatError(message || "Chat connection error");
    });

    socketRef.current = socket;
  };

  const loadConversations = async () => {
    try {
      const response = await getMyConversations();
      const list = response.conversations || [];
      setConversations(list);
      if (list.length > 0 && !selectedConversationId) {
        setSelectedConversation(list[0]);
      }
    } catch (err) {
      setChatError(err.response?.data?.message || "Failed to load chats");
    }
  };

  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setChatError("");
    try {
      const response = await getConversationMessages(conversation._id);
      setMessages(response.messages || []);
      socketRef.current?.emit("chat:join", {
        conversationId: conversation._id,
      });
    } catch (err) {
      setChatError(err.response?.data?.message || "Failed to load messages");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    connectSocket();
    loadConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const found = conversations.find(
      (conversation) => conversation._id === selectedConversationId,
    );
    if (found) {
      setSelectedConversation(found);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    activeConversationIdRef.current = selectedConversationId || null;
  }, [selectedConversationId]);

  useEffect(() => {
    if (!selectedConversation) return;
    openConversation(selectedConversation);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages]);

  const onStartChat = async (shopId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await startConversation(shopId);
      const nextConversation = response.conversation;

      setConversations((prev) => {
        const exists = prev.some(
          (conversation) => conversation._id === nextConversation._id,
        );
        const next = exists
          ? prev.map((conversation) =>
              conversation._id === nextConversation._id
                ? nextConversation
                : conversation,
            )
          : [nextConversation, ...prev];

        return next.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      });

      setSelectedConversation(nextConversation);
    } catch (err) {
      setChatError(err.response?.data?.message || "Unable to start chat");
    }
  };

  const onSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedConversationId || !messageText.trim()) {
      return;
    }

    setSending(true);
    setChatError("");

    try {
      const text = messageText.trim();
      setMessageText("");

      if (socketRef.current?.connected) {
        socketRef.current.emit("chat:send", {
          conversationId: selectedConversationId,
          text,
        });
      } else {
        const response = await sendMessageHttp(selectedConversationId, text);
        const sentMessage = response.message;
        setMessages((prev) => [...prev, sentMessage]);
        setConversations((prev) =>
          prev
            .map((conversation) =>
              conversation._id === selectedConversationId
                ? {
                    ...conversation,
                    lastMessage: {
                      text: sentMessage.text,
                      senderId:
                        sentMessage.senderId?._id || sentMessage.senderId,
                      createdAt: sentMessage.createdAt,
                    },
                    updatedAt: sentMessage.createdAt,
                  }
                : conversation,
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
        );
      }
    } catch (err) {
      setChatError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const activeConversationTitle = useMemo(
    () => getConversationTitle(selectedConversation),
    [selectedConversation],
  );

  if (loading) {
    return (
      <div className="connect-page loading-state">
        <Loader />
      </div>
    );
  }

  return (
    <div className="connect-page">
      <div className="connect-hero">
        <h1>Connect With Local Shops</h1>
        <p>
          Explore all registered DealBasket sellers. This list includes only
          user-registered shops and does not include web-scraped stores.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && shops.length === 0 && (
        <div className="empty-state">No registered shops available yet.</div>
      )}

      {isLoggedIn && (
        <section className="chat-shell">
          <div className="chat-conversations">
            <h3>Recent Chats</h3>
            {conversations.length === 0 ? (
              <div className="chat-empty">
                No chats yet. Start from any shop below.
              </div>
            ) : (
              <ul>
                {conversations.map((conversation) => (
                  <li key={conversation._id}>
                    <button
                      className={
                        selectedConversationId === conversation._id
                          ? "conversation-btn active"
                          : "conversation-btn"
                      }
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="conversation-title">
                        {getConversationTitle(conversation)}
                      </div>
                      <div className="conversation-preview">
                        {conversation.lastMessage?.text || "No messages yet"}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="chat-window">
            <div className="chat-window__header">
              <h3>{activeConversationTitle || "Select a chat"}</h3>
            </div>
            <div className="chat-window__messages" ref={messagesContainerRef}>
              {!selectedConversationId && (
                <div className="chat-placeholder">
                  Choose a chat to view messages.
                </div>
              )}

              {selectedConversationId && messages.length === 0 && (
                <div className="chat-placeholder">
                  No messages yet. Say hello.
                </div>
              )}

              {selectedConversationId &&
                messages.map((message) => {
                  const senderId = message.senderId?._id || message.senderId;
                  const isMine = senderId === user?.id;

                  return (
                    <div
                      key={message._id}
                      className={
                        isMine ? "message-bubble mine" : "message-bubble"
                      }
                    >
                      <p>{message.text}</p>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  );
                })}
            </div>

            <form className="chat-input-row" onSubmit={onSendMessage}>
              <input
                type="text"
                placeholder={
                  selectedConversationId
                    ? "Type your message..."
                    : "Select a conversation to start typing"
                }
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                disabled={!selectedConversationId || sending}
              />
              <button
                type="submit"
                disabled={!selectedConversationId || sending}
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      {!isLoggedIn && (
        <div className="chat-login-note">
          Login to chat with shops in real time.
        </div>
      )}

      {chatError && <ErrorMessage message={chatError} />}

      <div className="shops-grid">
        {shops.map((shop) => (
          <article className="shop-card" key={shop._id}>
            <div className="shop-card__top">
              <div className="shop-avatar">{getInitials(shop.shopName)}</div>
              <div>
                <h2>{shop.shopName}</h2>
                <div className="shop-meta">
                  <span className="pill">
                    {shop.businessType || "individual"}
                  </span>
                  {shop.isVerified && (
                    <span className="pill verified">Verified</span>
                  )}
                </div>
              </div>
            </div>

            <p className="shop-description">
              {shop.shopDescription ||
                "This shop has not added a description yet."}
            </p>

            <div className="shop-info-row">
              <span>Phone</span>
              <a href={`tel:${shop.contactNumber}`}>{shop.contactNumber}</a>
            </div>
            <div className="shop-info-row">
              <span>Address</span>
              <p>{formatAddress(shop.address)}</p>
            </div>

            <button className="chat-btn" onClick={() => onStartChat(shop._id)}>
              Chat
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ConnectPage;
