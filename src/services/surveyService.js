import axios from "axios";
import { getApiBaseUrl } from "./apiService";

async function createSurveyApiClient() {
  const baseURL = await getApiBaseUrl();
  return axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
}

async function createOpenSurveyApiClient() {
  const baseURL = await getApiBaseUrl();
  return axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
}

export const surveyService = {
  getAllSurveys: async () => {
    const client = await createSurveyApiClient();
    const response = await client.get("/surveys");
    return response.data;
  },

  createSurvey: async (surveyData) => {
    const client = await createSurveyApiClient();
    const response = await client.post("/surveys", surveyData);
    return response.data;
  },

  getSurveyById: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.get(`/surveys/${surveyId}`);
    return response.data;
  },

  updateSurvey: async (surveyId, surveyData) => {
    const client = await createSurveyApiClient();
    const response = await client.put(`/surveys/${surveyId}`, surveyData);
    return response.data;
  },

  deleteSurvey: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.delete(`/surveys/${surveyId}`);
    return response.data;
  },

  assignQuestionToSurvey: async (surveyId, questionId) => {
    const client = await createSurveyApiClient();
    const response = await client.post(`/surveys/${surveyId}/question/${questionId}`);
    return response.data;
  },

  unassignQuestionFromSurvey: async (surveyId, questionId) => {
    const client = await createSurveyApiClient();
    const response = await client.delete(`/surveys/${surveyId}/question/${questionId}`);
    return response.data;
  },

  lockSurvey: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.patch(`/surveys/${surveyId}/lock`);
    return response.data;
  },

  unlockSurvey: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.patch(`/surveys/${surveyId}/unlock`);
    return response.data;
  },

  surveyExists: async (surveyId) => {
    const client = await createSurveyApiClient();
    const response = await client.get(`/surveys/${surveyId}/exists`);
    return response.data;
  },
};
