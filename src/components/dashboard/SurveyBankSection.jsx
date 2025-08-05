import React, { useEffect, useState, useMemo } from "react";
import { Eye, Search, ClipboardList } from "lucide-react";
import { surveyService } from '../../services/surveyService';
import { useSelector } from 'react-redux';
import SurveyBankDetails from "../survey/SurveyBankDetails";

const SurveyBankSection = ({ getSurveyTypeColor, getStatusColor, formatDate }) => {
  const { token } = useSelector(state => state.auth);

  const [surveysLocal, setSurveysLocal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await surveyService.getActiveAndClosedSurveys();
        setSurveysLocal(data);
      } catch (err) {
        setError("Erreur");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [token]);

  const filteredSurveys = useMemo(() => {
    return surveysLocal.filter(survey =>
      survey.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, surveysLocal]);

  const handleViewSurvey = async (surveyId) => {
  if (selectedSurvey?.surveyId === surveyId) {
    setSelectedSurvey(null);
    return;
  }
  setLoading(true);
  try {
    const data = await surveyService.getSurveyById(surveyId);
    console.log("Survey detail data:", data);
    setSelectedSurvey(data);
  } catch (error) {
    setError("Erreur lors du chargement du sondage");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Survey Bank Management</h2>
            <p className="text-sm text-gray-500">Manage your list of surveys in the bank</p>
          </div>
        </div>
        {/* Search bar */}
        <div className="flex mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search surveys by title or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="text-sm text-gray-500 ml-4">
            {filteredSurveys.length} result{filteredSurveys.length !== 1 && "s"} • {surveysLocal.length} total
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        {loading && <div>Chargement...</div>}
        {error && <div className="text-red-600">{error}</div>}
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
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    No surveys found.
                  </td>
                </tr>
              ) : filteredSurveys.map(survey => (
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
                      <button className="icon-btn" onClick={() => handleViewSurvey(survey.surveyId)}>
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  {selectedSurvey?.surveyId === survey.surveyId && (
                    <tr>
                      <td colSpan={5} className="bg-gray-100 p-4">
                        <SurveyBankDetails surveyId={selectedSurvey.surveyId} />
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

export default SurveyBankSection;
