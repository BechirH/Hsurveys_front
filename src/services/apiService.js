import axios from "axios";

let configPromise = null;

async function getConfig() {
  if (!configPromise) {
    configPromise = fetch('/config.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load config.json');
        return res.json();
      });
  }
  return configPromise;
}

export async function getApiBaseUrl() {
  const config = await getConfig();
  return config.API_URL;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function createUserApiClient() {
  const baseURL = await getApiBaseUrl();
  const client = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
  client.interceptors.request.use(config => {
    if (["post", "put", "delete", "patch"].includes(config.method)) {
      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  });
  return client;
}

async function createOrgApiClient() {
  const baseURL = await getApiBaseUrl();
  const client = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
  client.interceptors.request.use(config => {
    if (["post", "put", "delete", "patch"].includes(config.method)) {
      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  });
  return client;
}

async function createSurveyApiClient() {
  const baseURL = await getApiBaseUrl();
  const client = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
  client.interceptors.request.use(config => {
    if (["post", "put", "delete", "patch"].includes(config.method)) {
      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  });
  return client;
}

export const apiService = {
  // User endpoints
  getUsers: async () => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("[apiService] getUsers error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  addUser: async (userData) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("[apiService] addUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getRoles: async () => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.get("/roles");
      return response.data;
    } catch (error) {
      console.error("[apiService] getRoles error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getPermissions: async () => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.get("/permissions");
      return response.data;
    } catch (error) {
      console.error("[apiService] getPermissions error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  createRole: async (roleData) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.post("/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("[apiService] createRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  addPermissionToRole: async (roleId, permissionId) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.post(`/roles/${roleId}/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] addPermissionToRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] removePermissionFromRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  deleteRole: async (roleId) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.delete(`/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] deleteRole error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  assignRoleToUser: async (userId, roleId) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.post(`/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] assignRoleToUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  removeRoleFromUser: async (userId, roleId) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.delete(`/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("[apiService] removeRoleFromUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    const userApiClient = await createUserApiClient();
    try {
      const response = await userApiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("[apiService] updateUser error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  deleteUser: async (id) => {
    const userApiClient = await createUserApiClient();
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
    const orgApiClient = await createOrgApiClient();
    try {
      const response = await orgApiClient.get(`/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartments: async () => {
    const orgApiClient = await createOrgApiClient();
    try {
      const response = await orgApiClient.get("/departments");
      return response.data;
    } catch (error) {
      console.error("[apiService] getDepartments error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getTeams: async () => {
    const orgApiClient = await createOrgApiClient();
    try {
      const response = await orgApiClient.get("/teams");
      return response.data;
    } catch (error) {
      console.error("[apiService] getTeams error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  updateOrganization: async (id, organizationData) => {
    const orgApiClient = await createOrgApiClient();
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
    const surveyApiClient = await createSurveyApiClient();
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      console.error("[apiService] getSurveys error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getQuestions: async () => {
    const surveyApiClient = await createSurveyApiClient();
    try {
      const response = await surveyApiClient.get("/questions");
      return response.data;
    } catch (error) {
      console.error("[apiService] getQuestions error:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getSurveyResponses: async () => {
    const surveyApiClient = await createSurveyApiClient();
    try {
      const response = await surveyApiClient.get("/survey-response");
      return response.data;
    } catch (error) {
      console.error("[apiService] getSurveyResponses error:", error.response?.status, error.response?.data);
      throw error;
    }
  },
};
