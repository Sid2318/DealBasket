import { useState, useEffect, useContext, createContext } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
  isAuthenticated,
} from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (isAuthenticated()) {
        // Try to get current user with existing token
        const userData = await getCurrentUser();
        setUser(userData.user);
        setIsLoggedIn(true);
      } else {
        // Try to refresh token if no access token
        const refreshData = await refreshToken();
        setAccessToken(refreshData.accessToken);
        setUser(refreshData.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      // No valid session, user needs to login
      clearAccessToken();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);

      // Store access token
      setAccessToken(response.accessToken);
      setUser(response.user);
      setIsLoggedIn(true);

      return { success: true, data: response };
    } catch (error) {
      clearAccessToken();
      setUser(null);
      setIsLoggedIn(false);

      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if logout request fails, clear local state
      console.error("Logout error:", error);
    } finally {
      clearAccessToken();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.user);
      return userData.user;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      logout();
      return null;
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    refreshUserData,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

/* 
=== AUTH HOOK FUNCTIONS OVERVIEW ===

1. useAuth()
   - Custom hook to access authentication context
   - Must be used within AuthProvider
   - Returns auth state and methods
   - Throws error if used outside provider

2. AuthProvider({ children })
   - Main authentication context provider
   - Wraps app components to provide auth state
   - Manages user state, loading state, login status
   - Handles automatic token refresh and logout events

Provider State:
- user: Current user object (null if not authenticated)
- loading: Boolean indicating auth operations in progress
- isLoggedIn: Boolean indicating authentication status

Provider Methods:

3. checkAuthStatus()
   - Checks current authentication state on app load
   - Tries existing access token first
   - Falls back to refresh token if needed
   - Sets user state and login status
   - Called automatically on mount

4. login(credentials)
   - Handles user login process
   - Calls loginUser API with email/password
   - Stores access token and user data
   - Returns {success: true/false, error?: string}
   - Updates global auth state on success

5. logout()
   - Handles user logout process
   - Calls logoutUser API to invalidate tokens
   - Clears access token and user data
   - Updates global auth state
   - Safe to call even if API fails

6. refreshUserData()
   - Refreshes current user data from server
   - Useful after profile updates or role changes
   - Calls getCurrentUser API
   - Updates user state or logs out on failure

Event Listeners:
- Listens for 'auth:logout' events from axios interceptor
- Auto-logout when token refresh fails
- Cross-tab logout support

Usage:
const { user, isLoggedIn, login, logout } = useAuth();
*/
