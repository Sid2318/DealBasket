import api from "./axios";

export const getAllProducts = async (category, subcategory) => {
  const params = {};
  if (category) params.category = category;
  if (subcategory) params.subcategory = subcategory;

  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductsBySubcategory = async (subcategory) => {
  const response = await api.get(`/products/subcategory/${subcategory}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get("/products/categories/all");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
