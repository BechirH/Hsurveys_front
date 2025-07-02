import axios from "axios";

const ORG_API_BASE_URL = "http://46.62.136.95:8082/api";

// Create axios instance for organization service
const orgApiClient = axios.create({
  baseURL: ORG_API_BASE_URL,
  timeout: 10000,
});

// Create a separate axios instance for open APIs (no auth required)
const openOrgApiClient = axios.create({
  baseURL: ORG_API_BASE_URL,
  timeout: 10000,
});

// Helper to set token header
const setAuthToken = (token) => {
  if (token) {
    orgApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete orgApiClient.defaults.headers.common["Authorization"];
  }
};

export const organizationService = {
  // Set token for future requests (only affects authenticated endpoints)
  setAuthToken,

  // Create a new organization (OPEN API - no authentication required)
  createOrganization: async (orgData) => {
    try {
      const response = await openOrgApiClient.post("/organizations", orgData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current organization (REQUIRES AUTH)
  getCurrentOrganization: async (organizationId) => {
    try {
      const response = await orgApiClient.get(
        `/organizations/${organizationId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get organization departments (REQUIRES AUTH)
  getDepartments: async () => {
    try {
      const response = await orgApiClient.get("/organizations/departments");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get organization teams (REQUIRES AUTH)
  getTeams: async () => {
    try {
      const response = await orgApiClient.get("/organizations/teams");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
