import axios from "axios";
import { getApiBaseUrl } from "./apiService";

const setOptionAuthToken = (client, token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

export const optionService = {
  setOptionAuthToken: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    return client;
  },

  createOption: async (optionData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.post("/options", optionData);
    return response.data;
  },

  getAllOptions: async (token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.get("/options");
    return response.data;
  },

  getOptionById: async (optionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.get(`/options/${optionId}`);
    return response.data;
  },

  getOptionsByQuestionId: async (questionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.get(`/options/byQuestion/${questionId}`);
    return response.data;
  },

  updateOption: async (optionId, optionData, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.put(`/options/${optionId}`, optionData);
    return response.data;
  },

  deleteOption: async (optionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.delete(`/options/${optionId}`);
    return response.data;
  },

  lockOption: async (optionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.patch(`/options/${optionId}/lock`);
    return response.data;
  },

  unlockOption: async (optionId, token) => {
    const baseURL = await getApiBaseUrl();
    const client = axios.create({ baseURL, timeout: 10000 });
    setOptionAuthToken(client, token);
    const response = await client.patch(`/options/${optionId}/unlock`);
    return response.data;
  },
};
