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

// Helper to set token header for each client
const setUserAuthToken = (token) => {
  if (token) {
    console.log("[apiService] Setting User API Bearer token:", token);
    userApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("[apiService] Clearing User API Bearer token");
    delete userApiClient.defaults.headers.common["Authorization"];
  }
};

const setOrgAuthToken = (token) => {
  if (token) {
    console.log("[apiService] Setting Org API Bearer token:", token);
    orgApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("[apiService] Clearing Org API Bearer token");
    delete orgApiClient.defaults.headers.common["Authorization"];
  }
};

const setSurveyAuthToken = (token) => {
  if (token) {
    console.log("[apiService] Setting Survey API Bearer token:", token);
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
      const response = await userApiClient.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Role/Permission endpoints (User microservice)
  getRoles: async () => {
    try {
      const response = await userApiClient.get("/roles");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPermissions: async () => {
    try {
      const response = await userApiClient.get("/permissions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Organization endpoints
  getCurrentOrganization: async () => {
    try {
      const response = await orgApiClient.get("/organizations/current");
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
      throw error;
    }
  },
  getTeams: async () => {
    try {
      const response = await orgApiClient.get("/teams");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Survey endpoints
  getSurveys: async () => {
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getQuestions: async () => {
    try {
      const response = await surveyApiClient.get("/questions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSurveyResponses: async () => {
    try {
      const response = await surveyApiClient.get("/survey-response");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
