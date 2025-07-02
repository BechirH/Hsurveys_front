import axios from "axios";

const USER_API_URL = "http://localhost:8081/api";
const ORG_API_URL = "http://localhost:8082/api";
const SURVEY_API_URL = "http://localhost:8083/api";

// Create axios instances for each microservice
const userApiClient = axios.create({
  baseURL: USER_API_URL,
  timeout: 10000,
});

const orgApiClient = axios.create({
  baseURL: ORG_API_URL,
  timeout: 10000,
});

const surveyApiClient = axios.create({
  baseURL: SURVEY_API_URL,
  timeout: 10000,
});

// Add request interceptors to log headers
userApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

orgApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

surveyApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to set token header for each client
const setUserAuthToken = (token) => {
  if (token) {
    userApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete userApiClient.defaults.headers.common["Authorization"];
  }
};

const setOrgAuthToken = (token) => {
  if (token) {
    orgApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete orgApiClient.defaults.headers.common["Authorization"];
  }
};

const setSurveyAuthToken = (token) => {
  if (token) {
    surveyApiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
    delete surveyApiClient.defaults.headers.common["Authorization"];
  }
};

export const apiService = {
  // Set tokens for future requests
  setUserAuthToken,
  setOrgAuthToken,
  setSurveyAuthToken,

  // User endpoints
  getUsers: async () => {
    try {
      const response = await userApiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getUsers error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  addUser: async (userData) => {
    try {
      const response = await userApiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] addUser error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Role/Permission endpoints (User microservice)
  getRoles: async () => {
    try {
      const response = await userApiClient.get("/roles");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getRoles error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  getPermissions: async () => {
    try {
      const response = await userApiClient.get("/permissions");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getPermissions error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Organization endpoints
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

  getDepartments: async () => {
    try {
      const response = await orgApiClient.get("/departments");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getDepartments error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  getTeams: async () => {
    try {
      const response = await orgApiClient.get("/teams");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getTeams error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Survey endpoints
  getSurveys: async () => {
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getSurveys error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  getQuestions: async () => {
    try {
      const response = await surveyApiClient.get("/questions");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getQuestions error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  getSurveyResponses: async () => {
    try {
      const response = await surveyApiClient.get("/survey-response");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getSurveyResponses error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Assign a role to a user
  assignRoleToUser: async (userId, roleId) => {
    try {
      const response = await userApiClient.post(
        `/users/${userId}/roles/${roleId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] assignRoleToUser error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Remove a role from a user
  removeRoleFromUser: async (userId, roleId) => {
    try {
      const response = await userApiClient.delete(
        `/users/${userId}/roles/${roleId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] removeRoleFromUser error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Update a user
  updateUser: async (id, userData) => {
    try {
      const response = await userApiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] updateUser error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await userApiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] deleteUser error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },
};
