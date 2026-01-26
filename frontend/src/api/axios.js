import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Important: Include cookies for refresh tokens
});

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Get access token from localStorage (this will be updated by auth system)
const getAccessToken = () => localStorage.getItem("accessToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);
const clearAccessToken = () => localStorage.removeItem("accessToken");

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );

        const { accessToken } = response.data;
        setAccessToken(accessToken);

        // Process the queue with the new token
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed, clear tokens and redirect to login
        clearAccessToken();

        // Dispatch a custom event for the app to handle
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

/* 
=== AXIOS CONFIGURATION OVERVIEW ===

Main Configuration:
- baseURL: "http://localhost:3000" - Backend API base URL
- withCredentials: true - Include cookies in all requests for refresh tokens

Global Variables:
- isRefreshing: Prevents multiple simultaneous refresh attempts
- failedQueue: Stores requests waiting for token refresh

Token Management Functions:

1. getAccessToken()
   - Retrieves access token from localStorage
   - Returns token string or null

2. setAccessToken(token)
   - Stores access token in localStorage
   - Used after successful login/refresh

3. clearAccessToken()
   - Removes access token from localStorage
   - Used during logout/error handling

4. processQueue(error, token)
   - Processes all queued requests after token refresh
   - Resolves with new token or rejects with error
   - Clears the failed requests queue

Request Interceptor:
- Automatically attaches Authorization header
- Uses Bearer token format
- Runs before every API request
- Gets token from getAccessToken()

Response Interceptor:
- Handles successful responses (passes through)
- Intercepts 401 errors for token refresh
- Implements request queuing during refresh
- Automatic retry with new token

Token Refresh Flow:
1. Request fails with 401 error
2. Check if not already refreshing
3. Queue request if refresh in progress
4. Call refresh token endpoint
5. Store new access token
6. Retry original request with new token
7. Process all queued requests
8. Clear auth data if refresh fails

Error Handling:
- Dispatches 'auth:logout' event on refresh failure
- Clears tokens and redirects to login
- Prevents infinite refresh loops
- Graceful handling of network errors

Usage: Import and use 'api' instead of raw axios
All requests automatically get token attachment and refresh logic
*/
