import React from 'react';
import { X, Calendar, Users, FileText, Clock, Lock, Unlock, Plus } from 'lucide-react';
import SurveyDetails from '../survey/SurveyDetails';
import QuestionsTable from '../survey/QuestionsTable';

const ViewSurveyModal = ({ 
  open, 
  onClose, 
  survey, 
  onAddQuestions, 
  showQuestionsList, 
  questions, 
  onAddQuestionToSurvey,
  reloadGlobalQuestions 
}) => {
  if (!open || !survey) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSurveyTypeColor = (type) => {
    switch (type) {
      case 'FEEDBACK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXAM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-400 to-sky-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Survey Details</h3>
                  <p className="text-sky-100 text-sm">View and manage survey information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-sky-100 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {/* Survey Header Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">
                        {survey.title?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{survey.title}</h2>
                      <p className="text-gray-600 mt-1">{survey.description}</p>
                    </div>
                  </div>
                  
                  {/* Status and Type Badges */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(survey.status)}`}>
                      {survey.status}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSurveyTypeColor(survey.type)}`}>
                      {survey.type}
                    </span>
                    {survey.locked && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Survey Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-semibold text-gray-900">{formatDate(survey.deadline)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Questions</p>
                      <p className="font-semibold text-gray-900">
                        {survey.questions?.length || 0} questions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-semibold text-gray-900">
                        {survey.createdAt ? formatDate(survey.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Details Component */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <SurveyDetails 
                survey={survey} 
                onAddQuestions={onAddQuestions} 
                reloadGlobalQuestions={reloadGlobalQuestions}
              />
            </div>

            {/* Questions List */}
            {showQuestionsList && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Add Questions</h3>
                        <p className="text-sm text-gray-600">Select questions to add to this survey</p>
                      </div>
                    </div>
                  </div>
                </div>
                <QuestionsTable
                  questions={questions}
                  onAddToSurvey={onAddQuestionToSurvey}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSurveyModal; 