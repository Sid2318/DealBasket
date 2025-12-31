import api from "./axios";

export const savePurchase = async (purchaseData) => {
  const response = await api.post("/myhistory/purchase", purchaseData);
  return response.data;
};

export const getMyHistory = async () => {
  const response = await api.get("/myhistory");
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/myhistory/stats");
  return response.data;
};
