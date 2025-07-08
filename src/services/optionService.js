import axios from "axios";

const OPTION_API_BASE_URL = "http://46.62.136.95:8083/api";

const optionApiClient = axios.create({
  baseURL: OPTION_API_BASE_URL,
  timeout: 10000,
});

const setOptionAuthToken = (token) => {
  if (token) {
    optionApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete optionApiClient.defaults.headers.common["Authorization"];
  }
};

export const optionService = {
  setOptionAuthToken,

  // Créer une nouvelle option (POST /api/options)
  createOption: async (optionData) => {
    try {
      const response = await optionApiClient.post("/options", optionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer toutes les options (GET /api/options)
  getAllOptions: async () => {
    try {
      const response = await optionApiClient.get("/options");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une option par ID (GET /api/options/{id})
  getOptionById: async (optionId) => {
    try {
      const response = await optionApiClient.get(`/options/${optionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les options d'une question (GET /api/options/byQuestion/{questionId})
  getOptionsByQuestionId: async (questionId) => {
    try {
      const response = await optionApiClient.get(`/options/byQuestion/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une option (PUT /api/options/{id})
  updateOption: async (optionId, optionData) => {
    try {
      const response = await optionApiClient.put(`/options/${optionId}`, optionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une option (DELETE /api/options/{id})
  deleteOption: async (optionId) => {
    try {
      const response = await optionApiClient.delete(`/options/${optionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verrouiller une option (PATCH /api/options/{id}/lock)
  lockOption: async (optionId) => {
    try {
      const response = await optionApiClient.patch(`/options/${optionId}/lock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déverrouiller une option (PATCH /api/options/{id}/unlock)
  unlockOption: async (optionId) => {
    try {
      const response = await optionApiClient.patch(`/options/${optionId}/unlock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
