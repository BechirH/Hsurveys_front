import React from "react";
import { Plus, Eye, Edit, Lock, Unlock } from "lucide-react";

const SurveysSection = ({ surveys, getSurveyTypeColor, getStatusColor, formatDate, onCreateSurvey }) => (
  <div className="space-y-6">
    <div className="flex-between">
      <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
      <button onClick={onCreateSurvey} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Create Survey
      </button>
    </div>
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
            {surveys.map((survey) => (
              <tr key={survey.id} className="hover:bg-gray-50">
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
                    <button className="icon-btn">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default SurveysSection; 