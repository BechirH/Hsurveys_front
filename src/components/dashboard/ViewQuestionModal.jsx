import React from 'react';
import { X, Eye } from 'lucide-react';

const ViewQuestionModal = ({ 
  open, 
  onClose, 
  question 
}) => {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100 animate-slide-up border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Eye className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">View Question</h3>
            <p className="text-gray-600 mt-1">Question details and information</p>
          </div>
        </div>

        {/* Question Info Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {question.subject?.charAt(0).toUpperCase() || 'Q'}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{question.subject || 'Question'}</div>
              <div className="text-sm text-gray-600">
                {question.questionText?.substring(0, 50) + (question.questionText?.length > 50 ? '...' : '')}
              </div>
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <p className="text-gray-900 mt-1">{question.subject || 'No subject'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Question Text</label>
              <p className="text-gray-900 mt-1">{question.questionText || 'No question text'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Question Type</label>
              <p className="text-gray-900 mt-1">{question.questionType || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <p className="text-gray-900 mt-1">{question.locked ? 'Locked' : 'Unlocked'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Options</label>
              {question.options?.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {question.options.map((option, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 text-sm">{option.optionText}</span>
                      <span className="text-gray-500 text-sm">Score: {option.optionScore}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">No options</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 transform hover:scale-[1.02]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewQuestionModal; 