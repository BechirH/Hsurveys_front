import axios from "axios";

const SURVEY_API_BASE_URL = "http://46.62.136.95:8083/api";

// Instance Axios
const surveyApiClient = axios.create({
  baseURL: SURVEY_API_BASE_URL,
  timeout: 10000,
});

// Auth : Ajoute ou supprime le token dans les headers
const setSurveyAuthToken = (token) => {
  if (token) {
    surveyApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete surveyApiClient.defaults.headers.common["Authorization"];
  }
};

export const surveyService = {
  // Auth
  setSurveyAuthToken,

  // Récupérer tous les surveys
  getAllSurveys: async () => {
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un survey
  createSurvey: async (surveyData) => {
    try {
      const response = await surveyApiClient.post("/survey", surveyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un survey par ID
  getSurveyById: async (surveyId) => {
    try {
      const response = await surveyApiClient.get(`/survey/${surveyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un survey
  updateSurvey: async (surveyId, surveyData) => {
    try {
      const response = await surveyApiClient.put(`/survey/${surveyId}`, surveyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un survey
  deleteSurvey: async (surveyId) => {
    try {
      const response = await surveyApiClient.delete(`/survey/${surveyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assigner une question à un survey
  assignQuestionToSurvey: async (surveyId, questionId) => {
    try {
      const response = await surveyApiClient.post(`/survey/${surveyId}/question/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ❌ Détacher une question d'un survey
  unassignQuestionFromSurvey: async (surveyId, questionId) => {
    try {
      const response = await surveyApiClient.delete(`/survey/${surveyId}/question/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

