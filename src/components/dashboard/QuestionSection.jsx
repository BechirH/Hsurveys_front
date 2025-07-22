import React, { useState,useEffect  } from "react";
import QuestionForm from "../survey/QuestionForm";
import { questionService } from "../../services/questionService";

import { Eye, Edit, Lock, Unlock, Plus } from "lucide-react";
import Button from "../common/Button";

const QuestionsSection = ({ questions = [], reload }) => {
  console.log("Questions prop:", questions);
  const [showCreateForm, setShowCreateForm] = useState(false);
    const [localQuestions, setLocalQuestions] = useState(questions);

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await questionService.getAllQuestions();
      setLocalQuestions(res);
    } catch (err) {
      console.error("Error while fetching questions:", err);
    }
  };

  fetchQuestions();
}, [reload]);

  const handleSubmitQuestion = async (formData) => {
    try {
      const createdQuestion = await questionService.createQuestion({
        subject: formData.subject,
        questionText: formData.questionText,
        questionType: formData.questionType,
        locked: formData.locked,
        options: formData.options,
      });
      setLocalQuestions(prev => [...prev, createdQuestion]);
      
    } catch (err) {
      console.error("Error creating the question:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question management</h2>
        
      </div>

      

      <div className="card-base overflow-hidden">
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
  {localQuestions.map((question) => (
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
          <span className="text-gray-400 italic">No options</span>
        )}
      </td>
      <td className="table-cell-base text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="icon-btn" aria-label="View question details">
            <Eye className="w-4 h-4" />
          </button>
          <button className="icon-btn-green" aria-label="Edit this question">
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="text-orange-600 hover:text-orange-900"
            aria-label={question.locked ? "Unlock the question" : "Lock the question"}
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
      <div className="flex justify-end">
      <Button
        icon={Plus}
        onClick={() => setShowCreateForm((prev) => !prev)}
        variant="primary"
      >
        {showCreateForm ? "Cancel" : "Create a question"}
      </Button>

    </div>
    <div>
      {showCreateForm && (
        <QuestionForm onSubmit={handleSubmitQuestion} />
      )}
    </div>
    </div>
  );
};

export default QuestionsSection;
