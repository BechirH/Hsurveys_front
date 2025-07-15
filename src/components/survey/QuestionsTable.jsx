import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../common/Button";
import { questionService } from "../../services/questionService"; // Import du service

const QuestionsTable = ({ questions, onAddToSurvey }) => {
  const [searchSubject, setSearchSubject] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(questions || []);
  const [loading, setLoading] = useState(false);

  // Lorsqu'on reçoit une nouvelle liste 'questions' en props, on la copie dans filteredQuestions
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

 const handleSearchChange = async (e) => {
  const value = e.target.value;
  setSearchSubject(value);

  setLoading(true);
  try {
    if (value.trim() === "") {
      // Recharge toutes les questions depuis l’API
      const allQuestions = await questionService.getAllQuestions();
      setFilteredQuestions(allQuestions);
    } else {
      // Recherche filtrée
      const results = await questionService.getBySubject(value);
      setFilteredQuestions(results);
    }
  } catch (error) {
    console.error("Erreur lors de la recherche par sujet", error);
    setFilteredQuestions([]); // Affiche liste vide si erreur
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="card-base overflow-hidden">
      {/* Zone de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par sujet..."
          value={searchSubject}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>

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
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <tr
                  key={question.id || question.questionId}
                  className="hover:bg-gray-50"
                >
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                  Aucune question trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsTable;
