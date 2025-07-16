import axios from "axios";
import { getApiBaseUrl } from "./apiService";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function createOptionApiClient() {
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

export const optionService = {
  createOption: async (optionData) => {
    const client = await createOptionApiClient();
    const response = await client.post("/options", optionData);
    return response.data;
  },

  getAllOptions: async () => {
    const client = await createOptionApiClient();
    const response = await client.get("/options");
    return response.data;
  },

  getOptionById: async (optionId) => {
    const client = await createOptionApiClient();
    const response = await client.get(`/options/${optionId}`);
    return response.data;
  },

  getOptionsByQuestionId: async (questionId) => {
    const client = await createOptionApiClient();
    const response = await client.get(`/options/byQuestion/${questionId}`);
    return response.data;
  },

  updateOption: async (optionId, optionData) => {
    const client = await createOptionApiClient();
    const response = await client.put(`/options/${optionId}`, optionData);
    return response.data;
  },

  deleteOption: async (optionId) => {
    const client = await createOptionApiClient();
    const response = await client.delete(`/options/${optionId}`);
    return response.data;
  },

  lockOption: async (optionId) => {
    const client = await createOptionApiClient();
    const response = await client.patch(`/options/${optionId}/lock`);
    return response.data;
  },

  unlockOption: async (optionId) => {
    const client = await createOptionApiClient();
    const response = await client.patch(`/options/${optionId}/unlock`);
    return response.data;
  },
};
