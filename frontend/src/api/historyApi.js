import api from "./axios";

export const savePurchase = async (purchaseData, idempotencyKey = null) => {
  const response = await api.post("/myhistory/save", purchaseData, {
    headers: idempotencyKey
      ? {
          "Idempotency-Key": idempotencyKey,
        }
      : undefined,
  });
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
