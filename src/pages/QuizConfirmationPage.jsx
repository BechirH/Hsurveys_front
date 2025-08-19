import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { surveyService } from '../services/surveyService';

const QuizConfirmationPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from navigation state
  const { survey, questions, answers, questionFlags } = location.state || {};

  useEffect(() => {
    // Redirect if no data is available
    if (!survey || !questions || !answers) {
      navigate(`/quiz/${surveyId}`);
    }
  }, [survey, questions, answers, surveyId, navigate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await surveyService.submitSurveyAnswers(survey.surveyId, answers);
      alert('Survey submitted successfully! Thank you for your participation.');
      navigate('/user-home');
    } catch (err) {
      alert('Failed to submit survey. Please try again.');
      console.error('Error submitting survey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToQuiz = () => {
    navigate(`/quiz/${surveyId}`, {
      state: {
        survey,
        questions,
        answers,
        questionFlags
      }
    });
  };

  const handleEditAnswer = (questionIndex) => {
    navigate(`/quiz/${surveyId}`, {
      state: {
        survey,
        questions,
        answers,
        questionFlags,
        editQuestionIndex: questionIndex
      }
    });
  };

  const renderAnswerDisplay = (question) => {
    if (!question) return null;
    const answer = answers[question.questionId];

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE_TEXT':
      case 'MULTIPLE_CHOICE_IMAGE':
        if (answer !== undefined && question.options?.[answer]) {
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium">
                {question.options[answer].optionText}
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      case 'YES_NO':
        if (answer !== undefined) {
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium">
                {answer ? 'Yes' : 'No'}
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      case 'RATING_SCALE_ICONS':
        if (answer !== undefined) {
          const emojis = ['😞', '😐', '😊', '😄', '🤩'];
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium text-2xl">
                {emojis[answer - 1]} Rating: {answer}/5
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      case 'NUMERIC_SCALE':
        if (answer !== undefined) {
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium">
                Rating: {answer}/10
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      case 'FREE_TEXT':
        if (answer && answer.trim()) {
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium">
                {answer}
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      case 'DATE_PICKER':
        if (answer) {
          return (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800 font-medium">
                {new Date(answer).toLocaleDateString()}
              </span>
            </div>
          );
        }
        return <span className="text-red-600 italic">Not answered</span>;

      default:
        return <span className="text-gray-500 italic">Question type not supported</span>;
    }
  };

  if (!survey || !questions || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-red-300 text-xl mb-4">No data available</div>
          <button
            onClick={() => navigate(`/quiz/${surveyId}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden w-full max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="ml-16">
                <h2 className="text-4xl font-bold mb-3">Review Your Answers</h2>
                <p className="text-green-100 text-lg">Please review your answers before submitting</p>
              </div>
              <button
                onClick={handleBackToQuiz}
                className="text-white hover:text-gray-200 transition-colors p-3 hover:bg-white hover:bg-opacity-20 rounded-full absolute left-4 top-8"
                title="Back to Quiz"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Summary */}
            <div className="flex items-center justify-between text-green-100">
              <div className="flex items-center space-x-4">
                <span className="text-lg">
                  Total Questions: <span className="font-bold text-white">{questions.length}</span>
                </span>
                <span className="text-lg">
                  Answered: <span className="font-bold text-white">
                    {Object.keys(answers).filter(key =>
                      answers[key] !== undefined &&
                      answers[key] !== '' &&
                      answers[key] !== null
                    ).length}
                  </span>
                </span>
                <span className="text-lg">
                  Flagged: <span className="font-bold text-white">
                    {Object.keys(questionFlags || {}).filter(key => questionFlags[key]).length}
                  </span>
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {Math.round((Object.keys(answers).filter(key =>
                    answers[key] !== undefined &&
                    answers[key] !== '' &&
                    answers[key] !== null
                  ).length / questions.length) * 100)}%
                </div>
                <div className="text-sm">Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <div className="grid gap-6">
              {questions.map((question, index) => (
                <div key={question.questionId} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {question.subject || 'Question'}
                        </h3>

                        {/* Question Status Badge */}
                        <div className="flex items-center space-x-2">
                          {questionFlags?.[question.questionId] && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                              questionFlags[question.questionId] === 'uncertain'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}>
                              {questionFlags[question.questionId] === 'uncertain' ? '⚠ Uncertain' : '👁 Review'}
                            </span>
                          )}

                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            answers[question.questionId] !== undefined &&
                            answers[question.questionId] !== '' &&
                            answers[question.questionId] !== null
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}>
                            {answers[question.questionId] !== undefined &&
                             answers[question.questionId] !== '' &&
                             answers[question.questionId] !== null
                               ? '✓ Answered'
                               : '? Not Answered'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {question.questionText}
                      </p>

                      {/* Options Display + Answer Display */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Your Answer:</p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          {/* Affiche toutes les options si elles existent */}
                          {question.options && question.options.length > 0 && (
                            <ul className="mb-2">
                              {question.options.map((opt, idx) => (
                                <li
                                  key={opt.optionId || idx}
                                  className={`px-2 py-1 rounded mb-1 ${
                                    answers[question.questionId] === idx
                                      ? "bg-blue-100 text-blue-700 font-bold"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {opt.optionText}
                                  {answers[question.questionId] === idx && (
                                    <span className="ml-2 text-green-600">✓</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                          {/* Affiche la réponse choisie comme avant */}
                          
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditAnswer(index)}
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline hover:no-underline transition-all"
                      >
                        <span>✏️</span>
                        <span>Edit Answer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBackToQuiz}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-lg flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Quiz</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-medium text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Submit Survey</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfirmationPage;