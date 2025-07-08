import axios from "axios";

const QUESTION_API_BASE_URL = "http://46.62.136.95:8083/api";

const questionApiClient = axios.create({
  baseURL: QUESTION_API_BASE_URL,
  timeout: 10000,
});

const setQuestionAuthToken = (token) => {
  if (token) {
    questionApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete questionApiClient.defaults.headers.common["Authorization"];
  }
};

export const questionService = {
  // Définir le token d'authentification (à appeler dès que token dispo)
  setQuestionAuthToken,

  // Récupérer toutes les questions (GET /api/questions)
  getAllQuestions: async () => {
    try {
      const response = await questionApiClient.get("/questions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer une nouvelle question (POST /api/questions)
  createQuestion: async (questionData) => {
    try {
      const response = await questionApiClient.post("/questions", questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une question par ID (GET /api/questions/{id})
  getQuestionById: async (questionId) => {
    try {
      const response = await questionApiClient.get(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une question (PUT /api/questions/{id})
  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await questionApiClient.put(`/questions/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une question (DELETE /api/questions/{id})
  deleteQuestion: async (questionId) => {
    try {
      const response = await questionApiClient.delete(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verrouiller une question (PATCH /api/questions/{id}/lock)
  lockQuestion: async (questionId) => {
    try {
      const response = await questionApiClient.patch(`/questions/${questionId}/lock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déverrouiller une question (PATCH /api/questions/{id}/unlock)
  unlockQuestion: async (questionId) => {
    try {
      const response = await questionApiClient.patch(`/questions/${questionId}/unlock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher questions par sujet (GET /api/questions/subject/{subject})
  getBySubject: async (subject) => {
    try {
      const response = await questionApiClient.get(`/questions/subject/${encodeURIComponent(subject)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};