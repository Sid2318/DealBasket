import api from "./axios";

const API_URL = "/chat";

export const getMyConversations = async () => {
  const response = await api.get(`${API_URL}/conversations`);
  return response.data;
};

export const startConversation = async (sellerId) => {
  const response = await api.post(`${API_URL}/conversations/start`, {
    sellerId,
  });
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await api.get(
    `${API_URL}/conversations/${conversationId}/messages`,
  );
  return response.data;
};

export const sendMessageHttp = async (conversationId, text) => {
  const response = await api.post(
    `${API_URL}/conversations/${conversationId}/messages`,
    { text },
  );
  return response.data;
};
