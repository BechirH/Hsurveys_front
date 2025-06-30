import axios from "axios";

const AUTH_API_BASE_URL = "http://localhost:8081/api";

// Create axios instance for authenticated endpoints
const apiClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
});

// Create a separate axios instance for open APIs (no auth required)
const openApiClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
});

// Helper to set token header
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const authService = {
  // Login for all users (OPEN API - no authentication required)
  login: async (credentials) => {
    try {
      const response = await openApiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user for a new organization (Step 2) (OPEN API - no authentication required)
  registerUserForNewOrg: async (orgId, userData) => {
    try {
      const response = await openApiClient.post(
        `/auth/register/${orgId}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user for an existing organization (OPEN API - no authentication required)
  registerUserForExistingOrg: async (userData) => {
    try {
      const response = await openApiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate token with backend (REQUIRES AUTH)
  validateToken: async (token) => {
    setAuthToken(token);
    try {
      const response = await apiClient.get("/auth/validate");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set token for future requests (only affects authenticated endpoints)
  setAuthToken,

  // Logout (clear session on backend if needed) (REQUIRES AUTH)
  logout: async (token) => {
    setAuthToken(token);
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      setAuthToken(null);
    }
  },
};
