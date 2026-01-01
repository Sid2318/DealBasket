// Get seller sales stats (detailed)
export const getSellerSalesStats = async () => {
  const response = await axios.get(`${API_URL}/sales-stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
import axios from "axios";

const API_URL = "http://localhost:3000/seller";

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Register as seller
export const registerSeller = async (sellerData) => {
  const response = await axios.post(`${API_URL}/register`, sellerData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get seller profile
export const getSellerProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update seller profile
export const updateSellerProfile = async (data) => {
  const response = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Add product
export const addProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products`, productData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get seller products
export const getSellerProducts = async () => {
  const response = await axios.get(`${API_URL}/products`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update product
export const updateProduct = async (productId, data) => {
  const response = await axios.put(`${API_URL}/products/${productId}`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API_URL}/products/${productId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get seller stats
export const getSellerStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
