import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import QuestionForm from '../survey/QuestionForm';

const CreateQuestionFullModal = ({ open, onClose, onCreate, loading }) => {
  const [formData, setFormData] = useState(null);

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const handleCreate = async () => {
    if (formData) {
      await onCreate(formData);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    onClose();
  };

  if (!open) return null;

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
          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Créer une question</h3>
            <p className="text-gray-600 mt-1">Remplis les informations de la nouvelle question</p>
          </div>
        </div>
        {/* Formulaire de création */}
        <QuestionForm
          onSubmit={handleCreate}
          loading={loading}
          onChange={handleFormChange}
          showSubmitButton={false}
        />
        {/* Boutons d'action */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreate}
            disabled={loading || !formData}
          >
            <Plus className="w-5 h-5" />
            Créer
          </button>
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
    </div>
  );
};

export default CreateQuestionFullModal; 