import axios from "axios";

let configPromise = null;

// Charge config (ex: API_URL)
async function getConfig() {
  if (!configPromise) {
    configPromise = fetch("/config.json").then((res) => {
      if (!res.ok) throw new Error("Failed to load config.json");
      return res.json();
    });
  }
  return configPromise;
}

// Retourne base URL de l'API
export async function getApiBaseUrl() {
  const config = await getConfig();
  return config.API_URL;
}

// Récupère cookie par nom (ex: XSRF-TOKEN)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Création d'un client axios avec interception automatique du token CSRF
async function createApiClient() {
  const baseURL = await getApiBaseUrl();
  const client = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
  client.interceptors.request.use((config) => {
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

// Helper pour gérer les appels avec gestion d'erreur simple
async function handleRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    console.error("[apiService] error", error.response?.status, error.response?.data);
    throw error;
  }
}

export const apiService = {
  // ----- User endpoints -----
  getUsers: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/users"));
  },

  addUser: async (userData) => {
    const client = await createApiClient();
    return handleRequest(client.post("/users", userData));
  },

  updateUser: async (id, userData) => {
    const client = await createApiClient();
    return handleRequest(client.put(`/users/${id}`, userData));
  },

  deleteUser: async (id) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/users/${id}`));
  },

  getRoles: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/roles"));
  },

  createRole: async (roleData) => {
    const client = await createApiClient();
    return handleRequest(client.post("/roles", roleData));
  },

  deleteRole: async (roleId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/roles/${roleId}`));
  },

  addPermissionToRole: async (roleId, permissionId) => {
    const client = await createApiClient();
    return handleRequest(client.post(`/roles/${roleId}/permissions/${permissionId}`));
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/roles/${roleId}/permissions/${permissionId}`));
  },

  assignRoleToUser: async (userId, roleId) => {
    const client = await createApiClient();
    return handleRequest(client.post(`/users/${userId}/roles/${roleId}`));
  },

  removeRoleFromUser: async (userId, roleId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/users/${userId}/roles/${roleId}`));
  },

  getPermissions: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/permissions"));
  },

  // ----- Organization endpoints -----
  getCurrentOrganization: async (organizationId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/organizations/${organizationId}`));
  },

  getDepartments: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/departments"));
  },

  getTeams: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/teams"));
  },

  updateOrganization: async (id, organizationData) => {
    const client = await createApiClient();
    return handleRequest(client.put(`/organizations/${id}`, organizationData));
  },

  // ----- Survey endpoints -----
  getAllSurveys: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/api/surveys"));
  },

  createSurvey: async (surveyData) => {
    const client = await createApiClient();
    return handleRequest(client.post("/api/surveys", surveyData));
  },

  getSurveyById: async (surveyId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/surveys/${surveyId}`));
  },

  updateSurvey: async (surveyId, surveyData) => {
    const client = await createApiClient();
    return handleRequest(client.put(`/api/surveys/${surveyId}`, surveyData));
  },

  deleteSurvey: async (surveyId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/api/surveys/${surveyId}`));
  },

  assignQuestionToSurvey: async (surveyId, questionId) => {
    const client = await createApiClient();
    return handleRequest(client.post(`/api/surveys/${surveyId}/question/${questionId}`));
  },

  unassignQuestionFromSurvey: async (surveyId, questionId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/api/surveys/${surveyId}/question/${questionId}`));
  },

  lockSurvey: async (surveyId) => {
    const client = await createApiClient();
    return handleRequest(client.patch(`/api/surveys/${surveyId}/lock`));
  },

  unlockSurvey: async (surveyId) => {
    const client = await createApiClient();
    return handleRequest(client.patch(`/api/surveys/${surveyId}/unlock`));
  },

  surveyExists: async (surveyId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/surveys/${surveyId}/exists`));
  },

  // ----- Question endpoints -----
  getAllQuestions: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/api/questions"));
  },

  getQuestionById: async (questionId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/questions/${questionId}`));
  },

  createQuestion: async (questionData) => {
    const client = await createApiClient();
    return handleRequest(client.post("/api/questions", questionData));
  },

  updateQuestion: async (questionId, questionData) => {
    const client = await createApiClient();
    return handleRequest(client.put(`/api/questions/${questionId}`, questionData));
  },

  deleteQuestion: async (questionId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/api/questions/${questionId}`));
  },

  questionExists: async (questionId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/questions/${questionId}/exists`));
  },

  // ----- Option endpoints -----
  getAllOptions: async () => {
    const client = await createApiClient();
    return handleRequest(client.get("/api/options"));
  },

  getOptionById: async (optionId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/options/${optionId}`));
  },

  getOptionsByQuestionId: async (questionId) => {
    const client = await createApiClient();
    return handleRequest(client.get(`/api/options/byQuestion/${questionId}`));
  },

  createOption: async (optionData) => {
    const client = await createApiClient();
    return handleRequest(client.post("/api/options", optionData));
  },

  updateOption: async (optionId, optionData) => {
    const client = await createApiClient();
    return handleRequest(client.put(`/api/options/${optionId}`, optionData));
  },

  deleteOption: async (optionId) => {
    const client = await createApiClient();
    return handleRequest(client.delete(`/api/options/${optionId}`));
  },

  lockOption: async (optionId) => {
    const client = await createApiClient();
    return handleRequest(client.patch(`/api/options/${optionId}/lock`));
  },

  unlockOption: async (optionId) => {
    const client = await createApiClient();
    return handleRequest(client.patch(`/api/options/${optionId}/unlock`));
  },
};
