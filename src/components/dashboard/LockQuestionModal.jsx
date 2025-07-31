import React from 'react';
import { X, Lock, Unlock, AlertTriangle } from 'lucide-react';

const LockQuestionModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading, 
  question 
}) => {
  if (!open || !question) return null;

  const isLocked = question.locked;
  const actionText = isLocked ? 'Unlock' : 'Lock';
  const actionColor = isLocked ? 'from-orange-500 to-orange-600' : 'from-blue-500 to-blue-600';
  const icon = isLocked ? Unlock : Lock;

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
          <div className={`w-14 h-14 bg-gradient-to-r ${actionColor} rounded-xl flex items-center justify-center shadow-lg`}>
            {React.createElement(icon, { className: "w-7 h-7 text-white" })}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{actionText} Question</h3>
            <p className="text-gray-600 mt-1">
              {isLocked 
                ? 'Unlock this question to allow modifications' 
                : 'Lock this question to prevent modifications'
              }
            </p>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Question {actionText} Warning</h4>
              <p className="text-orange-700 text-sm mb-3">
                You are about to <span className="font-semibold">{actionText.toLowerCase()}</span> the question{' '}
                <span className="font-semibold">{question.subject}</span>. This will:
              </p>
              <ul className="text-orange-700 text-sm space-y-1 ml-4">
                {isLocked ? (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Allow editing and modification of the question
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Enable changes to question text and options
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Remove protection against accidental changes
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Prevent editing and modification of the question
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Protect question text and options from changes
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      Ensure question integrity and consistency
                    </li>
                  </>
                )}
              </ul>
            </div>
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r ${actionColor} hover:from-${isLocked ? 'orange' : 'blue'}-600 hover:to-${isLocked ? 'orange' : 'blue'}-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                {actionText}ing...
              </>
            ) : (
              <>
                                 {React.createElement(icon, { className: "w-5 h-5" })}
                {actionText} Question
              </>
            )}
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

export default LockQuestionModal; 