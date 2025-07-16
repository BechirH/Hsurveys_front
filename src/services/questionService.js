import axios from "axios";
import { getApiBaseUrl } from "./apiService";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function createQuestionApiClient() {
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

export const questionService = {
  getAllQuestions: async () => {
    const client = await createQuestionApiClient();
    const response = await client.get("/questions");
    return response.data;
  },

  createQuestion: async (questionData) => {
    const client = await createQuestionApiClient();
    const response = await client.post("/questions", questionData);
    return response.data;
  },

  getQuestionById: async (questionId) => {
    const client = await createQuestionApiClient();
    const response = await client.get(`/questions/${questionId}`);
    return response.data;
  },

  updateQuestion: async (questionId, questionData) => {
    const client = await createQuestionApiClient();
    const response = await client.put(`/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    const client = await createQuestionApiClient();
    const response = await client.delete(`/questions/${questionId}`);
    return response.data;
  },

  lockQuestion: async (questionId) => {
    const client = await createQuestionApiClient();
    const response = await client.patch(`/questions/${questionId}/lock`);
    return response.data;
  },

  unlockQuestion: async (questionId) => {
    const client = await createQuestionApiClient();
    const response = await client.patch(`/questions/${questionId}/unlock`);
    return response.data;
  },

  getBySubject: async (subject) => {
    const client = await createQuestionApiClient();
    const response = await client.get(`/questions/subject/${encodeURIComponent(subject)}`);
    return response.data;
  },
};
