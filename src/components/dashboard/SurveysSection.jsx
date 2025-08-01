import React, { useState, useEffect,useMemo } from "react";
import { Plus, Eye, Edit, Lock, Unlock,Trash2 } from "lucide-react";
import Button from "../common/Button";
import { surveyService } from '../../services/surveyService';
import { questionService } from '../../services/questionService';
import { useSelector } from 'react-redux';
import SurveyDetails from '../survey/SurveyDetails';
import QuestionsTable from "../survey/QuestionsTable";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditSurveyModal from "./EditSurveyModal";
import CreateSurveyModal from "./CreateSurveyModal";
import LockConfirmationModal from "./LockConfirmationModal";
import { Search,ClipboardList } from "lucide-react";



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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLockModal, setShowLockModal] = useState(false);
  const [surveyToToggleLock, setSurveyToToggleLock] = useState(null);


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

  const filteredSurveys = useMemo(() => {
    return surveysLocal.filter(survey =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      survey.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, surveysLocal]);

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
  const handleDeleteSurvey = async () => {
    if (!surveyToDelete) return;
  setDeleting(true);
  try {
    await surveyService.deleteSurvey(surveyToDelete.surveyId);
    setSurveysLocal((prev) => prev.filter(s => s.surveyId !== surveyToDelete.surveyId));
    if (selectedSurvey && selectedSurvey.surveyId === surveyToDelete.surveyId) {
      setSelectedSurvey(null);
    }
    setShowDeleteModal(false);
    setSurveyToDelete(null);
  } catch (err) {
    console.error("Error deleting survey:", err);
    setError("Error deleting the survey.");
  } finally {
    setDeleting(false);
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
    <div className="space-y-4">
      {/* Header + bouton création */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
              <ClipboardList className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Survey Management</h2>
                <p className="text-sm text-gray-500">Manage your list of surveys</p>
              </div>
            </div>
          <Button
          icon={Plus}
          variant="primary"
          className="bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600"

          onClick={() => setShowCreateForm(prev => !prev)}
          >
            {showCreateForm ? "Cancel" : "Create Survey"}
          </Button>
        </div>
        {/* Barre de recherche + résumé total */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
            type="text"
            placeholder="Search surveys by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            </div>
            <div className="text-sm text-gray-500">
              {filteredSurveys.length} result{filteredSurveys.length !== 1 && "s"} • {surveysLocal.length} total
            </div>
          </div>
        </div>

      <CreateSurveyModal
      open={showCreateForm}
      onClose={() => setShowCreateForm(false)}
      form={form}
      setForm={setForm}
      onSubmit={editingSurvey ? handleUpdateSurvey : handleSubmit}
      loading={loading}
      error={error}
      />


<div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
    
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
              {filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No surveys found.
                  </td>
                </tr>
                ) : filteredSurveys.map((survey) => (       
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
                        <button
                        className="icon-btn-green"
                        onClick={() => {
                          setSelectedSurvey(survey);
                          setShowEditModal(true);
                          }}
                          >
                            <Edit className="w-4 h-4" />
                        </button>

                        <button
                         className="text-orange-600 hover:text-orange-900"
                          onClick={() => {
                            setSurveyToToggleLock(survey);
                            setShowLockModal(true);
                          }}
                          title={survey.locked ? "Unlock Survey" : "Lock Survey"}
                        >
                          {survey.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        <button
                        onClick={() => {
                          setSurveyToDelete(survey);
                          setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
      <div>
    {/* Ton tableau ou liste de surveys ici */}
    
    {/* Modale de suppression */}
    <DeleteConfirmationModal
      open={showDeleteModal}
      onClose={() => {
        setShowDeleteModal(false);
        setSurveyToDelete(null);
      }}
      onConfirm={handleDeleteSurvey}
      loading={deleting}
      entity={surveyToDelete}
      entityType="survey"
      title="Delete Survey"
      description="This action is irreversible. The survey and its links will be permanently deleted."
      warningItems={[
        "All associated questions will remain, but the link to this survey will be removed.",
        "Results and participations related to this survey will be lost.",
        "There will be no way to restore this data after deletion."
      ]}
      entityDisplay={(survey) => ({
        avatar: survey.title?.charAt(0).toUpperCase(),
        name: survey.title,
        subtitle: survey.description
      })}
    />
    <EditSurveyModal
    open={showEditModal}
    onClose={() => setShowEditModal(false)}
    survey={selectedSurvey}
    onSuccess={async () => {
      const updated = await surveyService.getAllSurveys();
      setSurveysLocal(updated);
      setSelectedSurvey(updated.find(s => s.surveyId === selectedSurvey.surveyId));
      setShowEditModal(false);
    }}/>

    <LockConfirmationModal
    open={showLockModal}
    onClose={() => {
      setShowLockModal(false);
      setSurveyToToggleLock(null);
    }}
    onConfirm={async () => {
      if (!surveyToToggleLock) return;
      const id = surveyToToggleLock.surveyId;
      const locked = surveyToToggleLock.locked;
      setShowLockModal(false);
      try {
        await handleToggleLockSurvey(id, locked);
      } finally {
        setSurveyToToggleLock(null);
      }
    }}
    loading={loading}
    entity={surveyToToggleLock}
    entityType="survey"/>
     
      </div>      
    </div>
    
    
  );
};

export default SurveysSection;
