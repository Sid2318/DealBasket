import axios from "./axios.js";

// Backend base URL
const API_URL = "/auth";

// --------------------
// SEND OTP API (Step 1 of Registration)
// --------------------
export const sendOtp = async (userData) => {
  const response = await axios.post(`${API_URL}/send-otp`, userData);
  return response.data;
};

// --------------------
// VERIFY OTP API (Step 2 of Registration)
// --------------------
export const verifyOtp = async (email, otp) => {
  const response = await axios.post(
    `${API_URL}/verify-otp`,
    { email, otp },
    { withCredentials: true },
  );
  return response.data;
};

// --------------------
// RESEND OTP API
// --------------------
export const resendOtp = async (email) => {
  const response = await axios.post(`${API_URL}/resend-otp`, { email });
  return response.data;
};

// --------------------
// LEGACY SIGNUP API (redirects to OTP flow)
// --------------------
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// --------------------
// FORGOT PASSWORD API
// --------------------
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// --------------------
// RESET PASSWORD API
// --------------------
export const resetPassword = async (
  email,
  resetToken,
  password,
  confirmPassword,
) => {
  const response = await axios.post(`${API_URL}/reset-password`, {
    email,
    resetToken,
    password,
    confirmPassword,
  });
  return response.data;
};

// --------------------
// RESEND RESET TOKEN API
// --------------------
export const resendResetToken = async (email) => {
  const response = await axios.post(`${API_URL}/resend-reset-token`, { email });
  return response.data;
};

// --------------------
// LOGIN API
// --------------------
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true, // Important: Include cookies
  });
  return response.data;
};

// --------------------
// REFRESH TOKEN API
// --------------------
export const refreshToken = async () => {
  const response = await axios.post(
    `${API_URL}/refresh`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// --------------------
// LOGOUT API
// --------------------
export const logoutUser = async () => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// --------------------
// LOGOUT ALL DEVICES API
// --------------------
export const logoutAllDevices = async () => {
  const response = await axios.post(
    `${API_URL}/logout-all`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// --------------------
// GET CURRENT USER API
// --------------------
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

// --------------------
// TOKEN MANAGEMENT UTILITIES
// --------------------

// Store access token in localStorage
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

// Get access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Clear access token from localStorage
export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/* 
=== AUTH API FUNCTIONS OVERVIEW ===

Authentication Endpoints:

1. signupUser(userData)
   - POST /auth/signup
   - Creates new user account
   - Takes: {name, email, password}
   - Returns: {message: "User registered successfully"}

2. loginUser(userData)
   - POST /auth/login with credentials: true
   - Authenticates user and sets refresh token cookie
   - Takes: {email, password}
   - Returns: {message, accessToken, user}
   - Sets HTTP-only refresh token cookie

3. refreshToken()
   - POST /auth/refresh with credentials: true
   - Refreshes expired access token using cookie
   - No parameters needed (uses cookie)
   - Returns: {message, accessToken, user}

4. logoutUser()
   - POST /auth/logout with credentials: true
   - Logs out user and clears refresh token
   - Invalidates current device session
   - Returns: {message}

5. logoutAllDevices()
   - POST /auth/logout-all with credentials: true
   - Logs out user from all devices
   - Invalidates all user sessions
   - Returns: {message}

6. getCurrentUser()
   - GET /auth/me
   - Gets current authenticated user info
   - Requires valid access token in header
   - Returns: {user: {id, name, email, role}}

Token Management Utilities:

7. setAccessToken(token)
   - Stores access token in localStorage
   - Used after login/refresh operations

8. getAccessToken()
   - Retrieves access token from localStorage
   - Returns token string or null

9. clearAccessToken()
   - Removes access token from localStorage
   - Used during logout operations

10. isAuthenticated()
    - Checks if user has valid access token
    - Returns boolean (true if token exists)
    - Does not verify token validity

Note: All auth endpoints use withCredentials: true for cookie support
Access tokens are stored in localStorage, refresh tokens in HTTP-only cookies
*/
