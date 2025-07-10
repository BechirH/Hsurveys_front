import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Lock, Unlock, Check } from "lucide-react";
import Button from "../common/Button";
import { surveyService } from '../../services/surveyService';
import { questionService } from '../../services/questionService';
import { useSelector } from 'react-redux';
import SurveyDetails from '../survey/SurveyDetails';
import SurveyForm from "../survey/SurveyForm";
import QuestionsTable from "../survey/QuestionsTable";


const SURVEY_STATUSES = ["DRAFT", "ACTIVE", "CLOSED"];
const SURVEY_TYPES = ["FEEDBACK", "EXAM"];

const SurveysSection = ({ getSurveyTypeColor, getStatusColor, formatDate }) => {
  const { token } = useSelector(state => state.auth);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: SURVEY_TYPES[0],
    status: SURVEY_STATUSES[0],
    deadline: "",
    locked: false,
  });
  const [surveysLocal, setSurveysLocal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Nouvelle partie: gérer la liste des questions et modal d’ajout
  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  useEffect(() => {
    if (token) {
      surveyService.setSurveyAuthToken(token);
      questionService.setQuestionAuthToken(token);
    } else {
      console.warn("❌ Aucun token détecté dans Redux.");
    }

    const fetchSurveys = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await surveyService.getAllSurveys();
        setSurveysLocal(data);
      } catch (err) {
        console.error("📛 Erreur API:", err.response?.data || err.message);
        setError("Erreur lors du chargement des sondages.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [token]);
  const handleViewSurvey = async (surveyId) => {
  setLoading(true);
  try {
    const surveyData = await surveyService.getSurveyById(surveyId);
    setSelectedSurvey(surveyData);
  } catch (error) {
    console.error("Erreur chargement survey:", error);
  } finally {
    setLoading(false);
  }
};

  // Fonction pour charger les questions quand on veut les ajouter
  const handleAddQuestionsClick = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
      setSelectedQuestions(new Set());
      setShowQuestionsList(true);
    } catch (err) {
      console.error("Erreur chargement questions:", err);
      setError("Erreur lors du chargement des questions.");
    } finally {
      setLoading(false);
    }
  };

  // Sélection/désélection questions dans la liste
  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      const copy = new Set(prev);
      if (copy.has(questionId)) {
        copy.delete(questionId);
      } else {
        copy.add(questionId);
      }
      return copy;
    });
  };

  // Valider l’ajout des questions sélectionnées au sondage (doit être un sondage existant)
  const handleAssignQuestions = async () => {
    if (!selectedSurvey) {
      alert("Veuillez d'abord sélectionner un sondage.");
      return;
    }
    setLoading(true);
    try {
      for (const questionId of selectedQuestions) {
        await surveyService.assignQuestionToSurvey(selectedSurvey.surveyId, questionId);
      }
      // Reload survey details
      const updatedSurvey = await surveyService.getSurveyById(selectedSurvey.surveyId);
      setSelectedSurvey(updatedSurvey);
      setShowQuestionsList(false);
    } catch (err) {
      console.error("Erreur assignation questions:", err);
      setError("Erreur lors de l'ajout des questions au sondage.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestionToSurvey = async (questionId) => {
  if (!selectedSurvey) {
    alert("Veuillez d'abord sélectionner un sondage.");
    return;
  }
  setLoading(true);
  try {
    await surveyService.assignQuestionToSurvey(selectedSurvey.surveyId, questionId);
    const updatedSurvey = await surveyService.getSurveyById(selectedSurvey.surveyId);
    setSelectedSurvey(updatedSurvey);
  } catch (err) {
    console.error("Erreur assignation question:", err);
    setError("Erreur lors de l'ajout de la question au sondage.");
  } finally {
    setLoading(false);
  }
};

   // Lors de la création d’un sondage on peut directement l’ouvrir (et donc sélectionner)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const createdSurvey = await surveyService.createSurvey(form);
      setSurveysLocal((prev) => [...prev, createdSurvey]);
      setForm({
        title: "",
        description: "",
        type: SURVEY_TYPES[0],
        status: SURVEY_STATUSES[0],
        deadline: "",
        locked: false,
      });
      setShowCreateForm(false);
      setSelectedSurvey(createdSurvey);
      // Afficher direct la liste questions après création
      setSelectedQuestions(new Set());
      // Charger questions (optionnel, sinon on attend le clic sur Add Questions)
      const questionsData = await questionService.getAllQuestions();
      setQuestions(questionsData);
    } catch {
      setError("Erreur lors de la création du sondage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowCreateForm((prev) => !prev)}
            icon={Plus}
            variant="primary"
          >
            {showCreateForm ? "Cancel" : "Create Survey"}
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <SurveyForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header-base">Title</th>
                <th className="table-header-base">Type</th>
                <th className="table-header-base">Status</th>
                <th className="table-header-base">Deadline</th>
                <th className="table-header-base">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surveysLocal.map((survey) => (
                <React.Fragment key={survey.surveyId}>
                  <tr className="hover:bg-gray-50">
                    <td className="table-cell-base">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                        <div className="text-sm text-gray-500">{survey.description}</div>
                      </div>
                    </td>
                    <td className="table-cell-base">
                      <span className={`tag-base ${getSurveyTypeColor(survey.type)}`}>{survey.type}</span>
                    </td>
                    <td className="table-cell-base">
                      <span className={`tag-base ${getStatusColor(survey.status)}`}>{survey.status}</span>
                    </td>
                    <td className="table-cell-base text-sm text-gray-500">
                      {survey.deadline ? formatDate(survey.deadline) : 'No deadline'}
                    </td>
                    <td className="table-cell-base text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="icon-btn" onClick={() => handleViewSurvey(survey.surveyId)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="icon-btn-green" onClick={() => setSelectedSurvey(survey)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900">
                          {survey.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {selectedSurvey && selectedSurvey.surveyId === survey.surveyId && (
                    <tr>
                      <td colSpan={5} className="bg-gray-100 p-4 space-y-4">
                        <SurveyDetails survey={selectedSurvey} onAddQuestions={handleAddQuestionsClick} />
                        {showQuestionsList && (
                          <QuestionsTable
                          questions={questions}
                          onAddToSurvey={handleAddQuestionToSurvey}
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default SurveysSection;
