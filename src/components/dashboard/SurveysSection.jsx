import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Lock, Unlock, Check, Trash } from "lucide-react";
import Button from "../common/Button";
import { surveyService } from '../../services/surveyService';
import { questionService } from '../../services/questionService';
import { useSelector } from 'react-redux';
import SurveyDetails from '../survey/SurveyDetails';
import SurveyForm from "../survey/SurveyForm";
import QuestionsTable from "../survey/QuestionsTable";


const SURVEY_STATUSES = ["DRAFT", "ACTIVE", "CLOSED"];
const SURVEY_TYPES = ["FEEDBACK", "EXAM"];

const SurveysSection = ({ getSurveyTypeColor, getStatusColor, formatDate, reload  }) => {
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


  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [editingSurvey, setEditingSurvey] = useState(null);


  useEffect(() => {
        const fetchSurveys = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await surveyService.getAllSurveys();
        setSurveysLocal(data);
      } catch (err) {
        console.error("📛 Erreur API:", err.response?.data || err.message);
        setError("Error loading surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [token]);

  const handleToggleLockSurvey = async (surveyId, isCurrentlyLocked) => {
  try {
    if (isCurrentlyLocked) {
      await surveyService.unlockSurvey(surveyId);
    } else {
      await surveyService.lockSurvey(surveyId);
    }

    
    setSurveysLocal((prev) =>
      prev.map((s) =>
        s.surveyId === surveyId ? { ...s, locked: !isCurrentlyLocked } : s
      )
    );

   
    if (selectedSurvey?.surveyId === surveyId) {
      setSelectedSurvey((prev) => ({
        ...prev,
        locked: !isCurrentlyLocked,
      }));
    }
  } catch (error) {
    console.error("Error toggling survey lock:", error);
    setError("Error toggling lock state.");
  }
};


  const handleViewSurvey = async (surveyId) => {
    if (selectedSurvey && selectedSurvey.surveyId === surveyId) {
      setSelectedSurvey(null);
      return;
    }
    setLoading(true);
    try {
      const surveyData = await surveyService.getSurveyById(surveyId);
      setSelectedSurvey(surveyData);
    } catch (error) {
      console.error("Survey loading error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey);
    setShowCreateForm(true);
    setForm({
      title: survey.title,
      description: survey.description,
      type: survey.type,
      status: survey.status,
      deadline: survey.deadline ? survey.deadline.slice(0, 16) : "",
      locked: survey.locked,
    });
  };
  const handleUpdateSurvey = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updatedSurvey = await surveyService.updateSurvey(editingSurvey.surveyId, form);
      setSurveysLocal((prev) =>
        prev.map((s) => (s.surveyId === updatedSurvey.surveyId ? updatedSurvey : s))
      );
      setEditingSurvey(null);
      setShowCreateForm(false);
      setSelectedSurvey(updatedSurvey);
    } catch {
      setError("Error updating the survey.");
    } finally {
      setLoading(false);
    }
  };


  const handleAddQuestionsClick = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
      setSelectedQuestions(new Set());
      setShowQuestionsList(true);
    } catch (err) {
      console.error("Questions loading error:", err);
      setError("Error loading questions.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) 
      return;
    setLoading(true);
    try {
      await surveyService.deleteSurvey(surveyId);
      setSurveysLocal((prev) => prev.filter(s => s.surveyId !== surveyId));
      if (selectedSurvey && selectedSurvey.surveyId === surveyId) {
        setSelectedSurvey(null);
      }
    } catch (err) {
      console.error("Error deleting survey:", err);
      setError("Error deleting the survey.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestionToSurvey = async (questionId) => {
  if (!selectedSurvey) {
    alert("Please select a survey first.");
    return;
  }
  setLoading(true);
  try {
    await surveyService.assignQuestionToSurvey(selectedSurvey.surveyId, questionId);
    const updatedSurvey = await surveyService.getSurveyById(selectedSurvey.surveyId);
    setSelectedSurvey(updatedSurvey);
  } catch (err) {
    console.error("Error assigning questions:", err);
    setError("Error adding questions to the survey.");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (editingSurvey) {
    return;
  }
  setLoading(true);
  setError("");
  try {
    const createdSurvey = await surveyService.createSurvey(form);
    setSurveysLocal(prev => [...prev, createdSurvey]);
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
    setSelectedQuestions(new Set());
    const questionsData = await questionService.getAllQuestions();
    setQuestions(questionsData);
  } catch {
    setError("Error creating the survey.");
  } finally {
    setLoading(false);
  }};


  const reloadAndFetchQuestions = async () => {
  try {
    const allQuestions = await questionService.getAllQuestions(); 
    setQuestions(allQuestions);
  } catch (error) {
    console.error("Error reloading questions.", error);
  }};

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
        <div className="flex space-x-2">
          <Button
          onClick={() => {
            setShowCreateForm(prev => {
              if (!prev) { 
                setForm({
                  title: "",
                  description: "",
                  type: SURVEY_TYPES[0],
                  status: SURVEY_STATUSES[0],
                  deadline: "",
                  locked: false,
                });
                setEditingSurvey(null);
              }
              return !prev;
            });
          }}
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
          onSubmit={editingSurvey ? handleUpdateSurvey : handleSubmit}
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
                        <button className="icon-btn-green" onClick={() => {
                          setSelectedSurvey(survey);
                          setForm({
                            title: survey.title,
                            description: survey.description,
                            type: survey.type,
                            status: survey.status,
                            deadline: survey.deadline ? survey.deadline.slice(0, 16) : "",
                            locked: survey.locked,
                          });
                          setShowCreateForm(true); 
                          setEditingSurvey(survey); 
                          }}>
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                         className="text-orange-600 hover:text-orange-900"
                          onClick={() => handleToggleLockSurvey(survey.surveyId, survey.locked)}
                          title={survey.locked ? "Unlock Survey" : "Lock Survey"}
                        >
                          {survey.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteSurvey(survey.surveyId)}>
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {selectedSurvey && selectedSurvey.surveyId === survey.surveyId && (
                    <tr>
                      <td colSpan={5} className="bg-gray-100 p-4 space-y-4">
                        <SurveyDetails survey={selectedSurvey} onAddQuestions={handleAddQuestionsClick} reloadGlobalQuestions={reloadAndFetchQuestions} />
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
