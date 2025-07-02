import React, { useState , useEffect} from "react"; 
import { Plus, Eye, Edit, Lock, Unlock } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { surveyService } from '../../services/surveyService';
import { useSelector } from 'react-redux';
import SurveyDetails from '../survey/SurveyDetails'

 
const SURVEY_STATUSES = ["DRAFT", "ACTIVE", "CLOSED"];
const SURVEY_TYPES = ["FEEDBACK", "EXAM"];

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

  useEffect(() => {
  if (token) {
    surveyService.setSurveyAuthToken(token); // ✅ injecte dans axios
  } else {
    console.warn("❌ Aucun token détecté dans Redux.");
  }

  const fetchSurveys = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await surveyService.getAllSurveys();
      setSurveysLocal(data);
      console.log("IDs des surveys:", data.map(s => s.id));  // <-- ici

    } catch (err) {
      console.error("📛 Erreur API:", err.response?.data || err.message);
      setError("Erreur lors du chargement des sondages.");
    } finally {
      setLoading(false);
    }
  };

  fetchSurveys();
}, [token]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleViewSurvey = async (surveyId) => {
  console.log("Survey ID to fetch:", surveyId); // Ceci doit afficher un UUID valide
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
      setSurveysLocal((prev) => [...prev, createdSurvey]); // ajoute à la liste locale
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

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          icon={Plus}
          variant="primary"
          disabled={loading}
        >
          {showCreateForm ? "Annuler" : "Create Survey"}
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white shadow">
          <InputField
            id="title"
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <InputField
            id="description"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            as="textarea"
            className="resize-y"
            disabled={loading}
          />

          <label className="block font-semibold mb-1" htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mb-4 p-2 border rounded w-full"
            disabled={loading}
          >
            {SURVEY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <label className="block font-semibold mb-1" htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mb-4 p-2 border rounded w-full"
            disabled={loading}
          >
            {SURVEY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <InputField
            id="deadline"
            label="Date limite"
            name="deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="mb-3 flex items-center">
            <input
              type="checkbox"
              id="locked"
              name="locked"
              checked={form.locked}
              onChange={handleChange}
              className="mr-2"
              disabled={loading}
            />
            <label htmlFor="locked" className="font-semibold">lock the Survey</label>
          </div>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <Button type="submit" loading={loading} fullWidth disabled={loading}>create Survey</Button>
        </form>
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
          <button className="icon-btn-green">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-orange-600 hover:text-orange-900">
            {survey.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>

    {/* Affichage conditionnel des détails sous la ligne */}
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
  </div>
  );
};


export default SurveysSection;