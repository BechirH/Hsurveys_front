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
    console.log("[userApiClient] Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

orgApiClient.interceptors.request.use(
  (config) => {
    console.log("[orgApiClient] Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

surveyApiClient.interceptors.request.use(
  (config) => {
    console.log("[surveyApiClient] Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to set token header for each client
const setUserAuthToken = (token) => {
  if (token) {
    console.log(
      "[apiService] Setting User API Bearer token:",
      token.substring(0, 20) + "..."
    );
    userApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("[apiService] Clearing User API Bearer token");
    delete userApiClient.defaults.headers.common["Authorization"];
  }
};

const setOrgAuthToken = (token) => {
  if (token) {
    console.log(
      "[apiService] Setting Org API Bearer token:",
      token.substring(0, 20) + "..."
    );
    orgApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("[apiService] Clearing Org API Bearer token");
    delete orgApiClient.defaults.headers.common["Authorization"];
  }
};

const setSurveyAuthToken = (token) => {
  if (token) {
    console.log(
      "[apiService] Setting Survey API Bearer token:",
      token.substring(0, 20) + "..."
    );
    surveyApiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
    console.log("[apiService] Clearing Survey API Bearer token");
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
      console.log("[apiService] Making getUsers request");
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

  // Role/Permission endpoints (User microservice)
  getRoles: async () => {
    try {
      console.log("[apiService] Making getRoles request");
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
      console.log("[apiService] Making getPermissions request");
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
  getCurrentOrganization: async () => {
    try {
      console.log("[apiService] Making getCurrentOrganization request");
      const response = await orgApiClient.get("/organizations/current");
      return response.data;
    } catch (error) {
      console.error(
        "[apiService] getCurrentOrganization error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  getDepartments: async () => {
    try {
      console.log("[apiService] Making getDepartments request");
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
      console.log("[apiService] Making getTeams request");
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
      console.log("[apiService] Making getSurveys request");
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
      console.log("[apiService] Making getQuestions request");
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
      console.log("[apiService] Making getSurveyResponses request");
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
};
