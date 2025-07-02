import axios from "axios";

const SURVEY_API_BASE_URL = "http://46.62.136.95:8083/api";

// Axios instance pour les appels nécessitant authentification
const surveyApiClient = axios.create({
  baseURL: SURVEY_API_BASE_URL,
  timeout: 10000,
});

// Helper pour gérer le token dans les headers Authorization
const setSurveyAuthToken = (token) => {
  if (token) {
    surveyApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete surveyApiClient.defaults.headers.common["Authorization"];
  }
};

export const surveyService = {
  // Définir le token d'authentification (à appeler dès que token dispo)
  setSurveyAuthToken,

  // Récupérer tous les sondages (GET /api/survey)
  getAllSurveys: async () => {
    try {
      const response = await surveyApiClient.get("/survey");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau sondage (POST /api/survey)
  createSurvey: async (surveyData) => {
    try {
      const response = await surveyApiClient.post("/survey", surveyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un sondage par ID (GET /api/survey/{id})
  getSurveyById: async (surveyId) => {
    try {
      const response = await surveyApiClient.get(`/survey/${surveyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un sondage (PUT /api/survey/{id})
  updateSurvey: async (surveyId, surveyData) => {
    try {
      const response = await surveyApiClient.put(`/survey/${surveyId}`, surveyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un sondage (DELETE /api/survey/{id})
  deleteSurvey: async (surveyId) => {
    try {
      const response = await surveyApiClient.delete(`/survey/${surveyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
