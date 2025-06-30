import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const AUTH_API_URL = "http://localhost:8081/api";

// Create axios instance for main API service
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Create axios instance for auth API service
const authApiClient = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 10000,
});

// Helper to set token header for main API
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Helper to set token header for auth API
const setAuthApiToken = (token) => {
  if (token) {
    authApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete authApiClient.defaults.headers.common["Authorization"];
  }
};

export const apiService = {
  // Set token for future requests
  setAuthToken,
  setAuthApiToken,

  // Organization endpoints
  getCurrentOrganization: async () => {
    try {
      const response = await apiClient.get("/organizations/current");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartments: async () => {
    try {
      const response = await apiClient.get("/organizations/departments");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTeams: async () => {
    try {
      const response = await apiClient.get("/organizations/teams");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User endpoints
  getUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Survey endpoints
  getSurveys: async () => {
    try {
      const response = await apiClient.get("/survey");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getQuestions: async () => {
    try {
      const response = await apiClient.get("/questions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSurveyResponses: async () => {
    try {
      const response = await apiClient.get("/survey-response");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Auth API endpoints
  getRoles: async () => {
    try {
      const response = await authApiClient.get("/roles");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPermissions: async () => {
    try {
      const response = await authApiClient.get("/permissions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
