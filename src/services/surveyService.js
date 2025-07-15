import axios from "axios";
import { getApiBaseUrl } from "./apiService";

const setSurveyAuthToken = (client, token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

export const surveyService = {
  setSurveyAuthToken: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    return client;
  },

  getAllSurveys: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.get("/survey");
    return response.data;
  },

  createSurvey: async (surveyData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.post("/survey", surveyData);
    return response.data;
  },

  getSurveyById: async (surveyId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.get(`/survey/${surveyId}`);
    return response.data;
  },

  updateSurvey: async (surveyId, surveyData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.put(`/survey/${surveyId}`, surveyData);
    return response.data;
  },

  deleteSurvey: async (surveyId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.delete(`/survey/${surveyId}`);
    return response.data;
  },

  assignQuestionToSurvey: async (surveyId, questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.post(`/survey/${surveyId}/question/${questionId}`);
    return response.data;
  },

  unassignQuestionFromSurvey: async (surveyId, questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setSurveyAuthToken(client, token);
    const response = await client.delete(`/survey/${surveyId}/question/${questionId}`);
    return response.data;
  },
};

