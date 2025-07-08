import React, { useState , useEffect} from "react"; 
import { Plus, Eye, Edit, Lock, Unlock } from "lucide-react";
import Button from "../common/Button";
import { surveyService } from '../../services/surveyService';
import { questionService } from '../../services/questionService';
import { optionService } from "../../services/optionService";
import { useSelector } from 'react-redux';
import SurveyDetails from '../survey/SurveyDetails'
import SurveyForm from "../survey/SurveyForm";
import QuestionForm from "../survey/QuestionForm";


 
const SURVEY_STATUSES = ["DRAFT", "ACTIVE", "CLOSED"];
const SURVEY_TYPES = ["FEEDBACK", "EXAM"];
const QUESTION_TYPES = [
  "RATING_SCALE_ICONS",
  "FREE_TEXT",
  "DATE_PICKER",
  "MULTIPLE_CHOICE_TEXT",
  "MULTIPLE_CHOICE_IMAGE",
  "NUMERIC_SCALE",
  "YES_NO"
];

const SurveysSection = ({ surveys, getSurveyTypeColor, getStatusColor, formatDate, onCreateSurvey }) => {
const { token } = useSelector(state => state.auth);
console.log("Token:", token);  
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
  const [questionsLocal, setQuestionsLocal] = useState([]);
  const [showCreateQuestionForm, setShowCreateQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    subject: "",
    questionText: "",
    questionType: QUESTION_TYPES[0],
    locked: false,
    options: [],
  });
const [questionLoading, setQuestionLoading] = useState(false);
const [questionError, setQuestionError] = useState("");

  useEffect(() => {
  if (token) {
    surveyService.setSurveyAuthToken(token);
    questionService.setQuestionAuthToken(token);
    optionService.setOptionAuthToken(token);
  } else {
    console.warn("❌ Aucun token détecté dans Redux.");
  }

  const fetchSurveys = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await surveyService.getAllSurveys();
      setSurveysLocal(data);
      console.log("IDs des surveys:", data.map(s => s.id));

    } catch (err) {
      console.error("📛 Erreur API:", err.response?.data || err.message);
      setError("Erreur lors du chargement des sondages.");
    } finally {
      setLoading(false);
    }
  };
  const fetchQuestions = async () => {
    setQuestionLoading(true);
    setQuestionError("");
    try {
      const data = await questionService.getAllQuestions();
      setQuestionsLocal(data);
    } catch (err) {
      setQuestionError("Erreur lors du chargement des questions.");
    } finally {
      setQuestionLoading(false);
    }
  };

  fetchSurveys();
  fetchQuestions();
}, [token]);



  


  const handleViewSurvey = async (surveyId) => {
  console.log("Survey ID to fetch:", surveyId);
  setLoading(true);
  try {
    const surveyData = await surveyService.getSurveyById(surveyId);
    setSelectedSurvey(surveyData);
  } catch (error) {
    console.error("Erreur chargement survey:", error);
  } finally {
    setLoading(false);
  }};

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
    } catch {
      setError("Erreur lors de la création du sondage.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (formData) => {
  setQuestionLoading(true);
  setQuestionError("");
  try {
    // 1. Créer la question
    const createdQuestion = await questionService.createQuestion({
      subject: formData.subject,
      questionText: formData.questionText,
      questionType: formData.questionType,
      locked: formData.locked,
    });

    // 2. Si la question a des options, on les crée avec l'ID de la question
    if (formData.questionType !== "FREE_TEXT" && formData.options.length > 0) {
      await Promise.all(
        formData.options.map((option) =>
          optionService.createOption({
            optionText: option.optionText,
            optionScore: option.optionScore,
            isCorrect: option.isCorrect,
            isLocked: option.isLocked,
            questionId: createdQuestion.questionId,
          })
        )
      );
    }

    // 3. Mise à jour locale
    setQuestionsLocal((prev) => [...prev, createdQuestion]);
    setQuestionForm({
      subject: "",
      questionText: "",
      questionType: QUESTION_TYPES[0],
      locked: false,
      options: [],
    });
    setShowCreateQuestionForm(false);
  } catch (error) {
    console.error("Erreur création question + options :", error);
    setQuestionError("Erreur lors de la création de la question.");
  } finally {
    setQuestionLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
        <div className="flex space-x-2">
          <Button
          onClick={() => {
            setShowCreateForm((prev) => !prev);
            setShowCreateQuestionForm(false);
          }}
          icon={Plus}
          variant="primary"
          >
            {showCreateForm ? "Cancel" : "Create Survey"}
          </Button>
          <Button
          onClick={() => {
            setShowCreateQuestionForm((prev) => !prev);
            setShowCreateForm(false);
          }}
          icon={Plus}
          variant="secondary"
          >
            {showCreateQuestionForm ? "Cancel" : "Create Question"}
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
      {showCreateQuestionForm && (
        <QuestionForm
        form={questionForm}
        setForm={setQuestionForm}
        onSubmit={handleSubmitQuestion}
        loading={questionLoading}
        error={questionError}
        />
        )
      }
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
                          <button className="icon-btn-green">
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
                      <td colSpan={5} className="bg-gray-100 p-4">
                        <SurveyDetails survey={selectedSurvey} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Affichage des questions */}
      {questionsLocal.length > 0 && (
        <div className="mt-6 card-base overflow-hidden">
          <h3 className="text-xl font-semibold mb-2">Question List</h3>
          <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
  <tr>
    <th className="table-header-base">Subject</th>
    <th className="table-header-base">Question</th>
    <th className="table-header-base">Options</th> 
    <th className="table-header-base">Actions</th>
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
  {questionsLocal.map((question) => (
    <tr key={question.id || question.questionId} className="hover:bg-gray-50">
      <td className="table-cell-base">{question.subject}</td>
      <td className="table-cell-base">{question.questionText}</td>
      <td className="table-cell-base">
        {question.options && question.options.length > 0 ? (
          <ul className="list-disc pl-4">
            {question.options.map((option, idx) => (
              <li key={idx}>{option.optionText} ({option.optionScore})</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400 italic">no options</span>
        )}
      </td>
      <td className="table-cell-base text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="icon-btn" aria-label="Voir question">
            <Eye className="w-4 h-4" />
          </button>
          <button className="icon-btn-green" aria-label="Modifier question">
            <Edit className="w-4 h-4" />
          </button>
          <button
            className={`text-orange-600 hover:text-orange-900`}
            aria-label={question.locked ? "Verrouiller question" : "Déverrouiller question"}
          >
            {question.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  </div>
)}
    </div>
    
  );
  
};


export default SurveysSection;