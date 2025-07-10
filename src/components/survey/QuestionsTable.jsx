import React from "react";
import { Plus } from "lucide-react";
import Button from "../common/Button";

const QuestionsTable = ({ questions, onAddToSurvey }) => {
  return (
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
                  <Button
                    icon={Plus}
                    variant="primary"
                    onClick={() => onAddToSurvey(question.questionId)}
                  >
                    Add to Survey
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsTable;

