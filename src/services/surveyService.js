import axios from "axios";
import { getApiBaseUrl } from "./apiService";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function createSurveyApiClient() {
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

export const surveyService = {
  getAllSurveys: async () => {
    const client = await createSurveyApiClient();
    const response = await client.get("/survey");
    return response.data;
  },

  createSurvey: async (surveyData) => {
    const client = await createSurveyApiClient();
    const response = await client.post("/survey", surveyData);
    return response.data;
  },

  getSurveyById: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.get(`/survey/${surveyId}`);
    return response.data;
  },

  updateSurvey: async (surveyId, surveyData) => {
    const client = await createSurveyApiClient();
    const response = await client.put(`/survey/${surveyId}`, surveyData);
    return response.data;
  },

  deleteSurvey: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.delete(`/survey/${surveyId}`);
    return response.data;
  },

  assignQuestionToSurvey: async (surveyId, questionId) => {
    const client = await createSurveyApiClient();
    const response = await client.post(`/survey/${surveyId}/question/${questionId}`);
    return response.data;
  },

  unassignQuestionFromSurvey: async (surveyId, questionId) => {
    const client = await createSurveyApiClient();
    const response = await client.delete(`/survey/${surveyId}/question/${questionId}`);
    return response.data;
  },
};
