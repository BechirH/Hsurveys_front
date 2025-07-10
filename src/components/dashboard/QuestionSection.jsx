import React, { useState } from "react";
import QuestionForm from "../survey/QuestionForm";
import { questionService } from "../../services/questionService";

import { Eye, Edit, Lock, Unlock, Plus } from "lucide-react";
import Button from "../common/Button";

const QuestionsSection = ({ questions, reload }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSubmitQuestion = async (formData) => {
    try {
      // Appel API pour créer la question
      await questionService.createQuestion({
        subject: formData.subject,
        questionText: formData.questionText,
        questionType: formData.questionType,
        locked: formData.locked,
      });
      // Recharge la liste globale
      await reload();
      setShowCreateForm(false);
    } catch (err) {
      console.error("Erreur lors de la création :", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestion des questions</h2>
        <Button
          icon={Plus}
          onClick={() => setShowCreateForm((prev) => !prev)}
          variant="primary"
        >
          {showCreateForm ? "Annuler" : "Créer une question"}
        </Button>
      </div>

      {showCreateForm && (
        <QuestionForm onSubmit={handleSubmitQuestion} />
      )}

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header-base">Sujet</th>
                <th className="table-header-base">Question</th>
                <th className="table-header-base">Options</th>
                <th className="table-header-base">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map((question) => (
                <tr key={question.id || question.questionId} className="hover:bg-gray-50">
                  <td className="table-cell-base">{question.subject}</td>
                  <td className="table-cell-base">{question.questionText}</td>
                  <td className="table-cell-base">
                    {question.options?.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {question.options.map((option, idx) => (
                          <li key={idx}>
                            {option.optionText} ({option.optionScore})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">Aucune option</span>
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
                        aria-label="Verrouiller question"
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
    </div>
  );
};

export default QuestionsSection;
