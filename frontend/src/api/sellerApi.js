import api from "./axios";

const API_URL = "/seller";

// Register as seller
export const registerSeller = async (sellerData) => {
  const response = await api.post(`${API_URL}/register`, sellerData);
  return response.data;
};

// Get seller profile
export const getSellerProfile = async () => {
  const response = await api.get(`${API_URL}/profile`);
  return response.data;
};

// Update seller profile
export const updateSellerProfile = async (data) => {
  const response = await api.put(`${API_URL}/profile`, data);
  return response.data;
};

// Add product
export const addProduct = async (productData) => {
  const response = await api.post(`${API_URL}/products`, productData);
  return response.data;
};

// Get seller products
export const getSellerProducts = async () => {
  const response = await api.get(`${API_URL}/products`);
  return response.data;
};

// Update product
export const updateProduct = async (productId, data) => {
  const response = await api.put(`${API_URL}/products/${productId}`, data);
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`${API_URL}/products/${productId}`);
  return response.data;
};

// Get seller stats
export const getSellerStats = async () => {
  const response = await api.get(`${API_URL}/stats`);
  return response.data;
};

// Get seller sales stats (detailed)
export const getSellerSalesStats = async () => {
  const response = await api.get(`${API_URL}/sales-stats`);
  return response.data;
};

// Get all registered shops (excludes scraped websites)
export const getRegisteredShops = async () => {
  const response = await api.get(`${API_URL}/registered-shops`);
  return response.data;
};
