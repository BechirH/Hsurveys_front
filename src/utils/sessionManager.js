// Session Management Utility
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const sessionManager = {
  // Store authentication data
  setSession: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log("Session stored:", {
        token: token ? "present" : "null",
        user,
      });
    } catch (error) {
      console.error("Error storing session:", error);
    }
  },

  // Get stored token
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  // Get stored user data
  getUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = sessionManager.getToken();
    const user = sessionManager.getUser();
    const isAuth = !!(token && user);
    console.log("Session check:", {
      token: token ? "present" : "null",
      user: user ? "present" : "null",
      isAuth,
    });
    return isAuth;
  },

  // Clear session data
  clearSession: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.log("Session cleared");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  },

  // Get authorization header for API requests
  getAuthHeader: () => {
    const token = sessionManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Check if token is expired (basic check)
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      // Decode JWT token (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  },

  // Debug method to log current session state
  debugSession: () => {
    const token = sessionManager.getToken();
    const user = sessionManager.getUser();
    console.log("Current session state:", {
      token: token ? "present" : "null",
      user: user ? "present" : "null",
      isAuthenticated: sessionManager.isAuthenticated(),
      isTokenExpired: token ? sessionManager.isTokenExpired(token) : "no token",
    });
  },
};

// Token expiration utility only
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};
