import axios from "axios";
import { getApiBaseUrl } from "./apiService";

const setQuestionAuthToken = (client, token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

export const questionService = {
  setQuestionAuthToken: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    return client;
  },

  getAllQuestions: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.get("/questions");
    return response.data;
  },

  createQuestion: async (questionData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.post("/questions", questionData);
    return response.data;
  },

  getQuestionById: async (questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.get(`/questions/${questionId}`);
    return response.data;
  },

  updateQuestion: async (questionId, questionData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.put(`/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.delete(`/questions/${questionId}`);
    return response.data;
  },

  lockQuestion: async (questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.patch(`/questions/${questionId}/lock`);
    return response.data;
  },

  unlockQuestion: async (questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.patch(`/questions/${questionId}/unlock`);
    return response.data;
  },

  getBySubject: async (subject, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setQuestionAuthToken(client, token);
    const response = await client.get(`/questions/subject/${encodeURIComponent(subject)}`);
    return response.data;
  },
};