import axios from "axios";


const AUTH_API_BASE_URL = process.env.REACT_APP_API_URL;



const apiClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, 
});


const openApiClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export const authService = {
  // Login for all users 
  login: async (credentials) => {
    try {
      const response = await openApiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user for a new organization (Step 2) 
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

  // Register user for an existing organization 
  registerUserForExistingOrg: async (userData) => {
    try {
      const response = await openApiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user info from backend (cookie-based)
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout (clear session on backend)
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    }
  },
};
