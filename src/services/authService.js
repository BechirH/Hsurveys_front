import axios from "axios";

const AUTH_API_BASE_URL = "http://localhost:8081/api";
const REGISTER_API_BASE_URL = "http://localhost:8081/api";

export const authService = {
  // Login for all users
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${AUTH_API_BASE_URL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      // Let the error bubble up to the thunk to handle
      throw error;
    }
  },

  // Register user for a new organization (Step 2)
  registerUserForNewOrg: async (orgId, userData) => {
    try {
      const response = await axios.post(
        `${REGISTER_API_BASE_URL}/auth/register/${orgId}`,
        userData
      );
      return response.data;
    } catch (error) {
      // Let the error bubble up to the thunk to handle
      throw error;
    }
  },

  // Register user for an existing organization
  registerUserForExistingOrg: async (userData) => {
    try {
      const response = await axios.post(
        `${REGISTER_API_BASE_URL}/auth/register`,
        userData
      );
      return response.data;
    } catch (error) {
      // Let the error bubble up to the thunk to handle
      throw error;
    }
  },
};
