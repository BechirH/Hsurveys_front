import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import QuestionForm from '../survey/QuestionForm';

const EditQuestionFullModal = ({ 
  open, 
  onClose, 
  onSave, 
  loading, 
  question 
}) => {
  const [formData, setFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        subject: question.subject || '',
        questionText: question.questionText || '',
        questionType: question.questionType || 'MULTIPLE_CHOICE',
        locked: question.locked || false,
        options: question.options || []
      });
      setHasChanges(false);
    }
  }, [question]);

  const handleFormChange = (newData) => {
    setFormData(newData);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (formData && hasChanges) {
      await onSave(formData);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100 animate-slide-up border border-gray-100">
        <button 
          onClick={handleCancel} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Save className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Question</h3>
            <p className="text-gray-600 mt-1">Modify the question details and options</p>
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

        {/* Warning for unsaved changes */}
        {hasChanges && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Unsaved Changes</h4>
                <p className="text-yellow-700 text-sm">
                  You have made changes to this question. Make sure to save your changes before closing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form - Simplified */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData?.subject || ''}
              onChange={(e) => handleFormChange({ ...formData, subject: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter question subject"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea
              value={formData?.questionText || ''}
              onChange={(e) => handleFormChange({ ...formData, questionText: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Enter question text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <select
              value={formData?.questionType || 'MULTIPLE_CHOICE'}
              onChange={(e) => handleFormChange({ ...formData, questionType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="FREE_TEXT">Free Text</option>
              <option value="RATING_SCALE_ICONS">Rating Scale Icons</option>
              <option value="YES_NO">Yes/No</option>
              <option value="NUMERIC_SCALE">Numeric Scale</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="locked"
              checked={formData?.locked || false}
              onChange={(e) => handleFormChange({ ...formData, locked: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="locked" className="text-sm font-medium text-gray-700">Lock question</label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
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

export default EditQuestionFullModal; 