import axios from "axios";


const GATEWAY_API_URL = process.env.REACT_APP_API_URL;


const userApiClient = axios.create({
  baseURL: GATEWAY_API_URL,
  timeout: 10000,
  withCredentials: true,
});

const orgApiClient = axios.create({
  baseURL: GATEWAY_API_URL,
  timeout: 10000,
  withCredentials: true,
});

const surveyApiClient = axios.create({
  baseURL: GATEWAY_API_URL,
  timeout: 10000,
  withCredentials: true,
});


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

[userApiClient, orgApiClient, surveyApiClient].forEach(client => {
  client.interceptors.request.use(config => {
    if (["post", "put", "delete", "patch"].includes(config.method)) {
      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  });
});

export const apiService = {
  userApiClient,
  orgApiClient,
  surveyApiClient,

  // User endpoints
  getUsers: async () => {
    try {
      const response = await userApiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("[apiService] getUsers error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  addUser: async (userData) => {
    try {
      const response = await userApiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("[apiService] addUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getRoles: async () => {
    try {
      const response = await userApiClient.get("/roles");
      return response.data;
    } catch (error) {
      console.error("[apiService] getRoles error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getPermissions: async () => {
    try {
      const response = await userApiClient.get("/permissions");
      return response.data;
    } catch (error) {
      console.error("[apiService] getPermissions error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await userApiClient.post("/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("[apiService] createRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  addPermissionToRole: async (roleId, permissionId) => {
    try {
      const response = await userApiClient.post(`/roles/${roleId}/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] addPermissionToRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    try {
      const response = await userApiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] removePermissionFromRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  deleteRole: async (roleId) => {
    try {
      const response = await userApiClient.delete(`/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] deleteRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  assignRoleToUser: async (userId, roleId) => {
    try {
      const response = await userApiClient.post(`/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] assignRoleToUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  removeRoleFromUser: async (userId, roleId) => {
    try {
      const response = await userApiClient.delete(`/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] removeRoleFromUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await userApiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("[apiService] updateUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await userApiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] deleteUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Organization endpoints
  getCurrentOrganization: async (organizationId) => {
    try {
      const response = await orgApiClient.get(`/organizations/${organizationId}`);
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
      console.error("[apiService] getDepartments error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getTeams: async () => {
    try {
      const response = await orgApiClient.get("/teams");
      return response.data;
    } catch (error) {
      console.error("[apiService] getTeams error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  updateOrganization: async (id, organizationData) => {
    try {
      const response = await orgApiClient.put(`/organizations/${id}`, organizationData);
      return response.data;
    } catch (error) {
      console.error("[apiService] updateOrganization error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Survey endpoints
  getSurveys: async () => {
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      console.error("[apiService] getSurveys error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getQuestions: async () => {
    try {
      const response = await surveyApiClient.get("/questions");
      return response.data;
    } catch (error) {
      console.error("[apiService] getQuestions error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getSurveyResponses: async () => {
    try {
      const response = await surveyApiClient.get("/survey-response");
      return response.data;
    } catch (error) {
      console.error("[apiService] getSurveyResponses error:", error.response?.status, error.response?.data);
      throw error;
    }
  },
};
