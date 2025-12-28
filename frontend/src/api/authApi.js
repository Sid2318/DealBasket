import axios from "axios";

// Backend base URL
const API_URL = "http://localhost:3000/auth";

// --------------------
// SIGNUP API
// --------------------
export const signupUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    userData
  );
  return response.data;
};

// --------------------
// LOGIN API
// --------------------
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );
  return response.data;
};
