import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, X, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { surveyService } from '../services/surveyService';
import { questionService } from '../services/questionService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const QuizPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [questionFlags, setQuestionFlags] = useState({});

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  // Check if we're returning from confirmation page with edit index
  useEffect(() => {
    const location = window.location;
    if (location.state?.editQuestionIndex !== undefined) {
      setCurrentQuestionIndex(location.state.editQuestionIndex);
      // Clear the state to avoid issues
      window.history.replaceState({}, document.title);
    }
  }, []);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const surveyData = await surveyService.getSurveyById(surveyId);
      setSurvey(surveyData);
      
      if (surveyData?.assignedQuestions?.length > 0) {
        const promises = surveyData.assignedQuestions.map(q => 
          questionService.getQuestionById(q.questionId)
        );
        const results = await Promise.all(promises);
        setQuestions(results);
        setAnswers({});
        setCurrentQuestionIndex(0);
      }
    } catch (err) {
      console.error('Error loading survey:', err);
      setError('Failed to load survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    const question = questions.find(q => q.questionId === questionId);
    if (!question) return;

    if (question.questionType === 'MULTIPLE_CHOICE_TEXT' || 
        question.questionType === 'MULTIPLE_CHOICE_IMAGE') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
    } else if (question.questionType === 'YES_NO') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex === 0
      }));
    }
  };

  const handleRatingChange = (questionId, rating) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await surveyService.submitSurveyAnswers(survey.surveyId, answers);
      alert('Survey submitted successfully! Thank you for your participation.');
      navigate('/user-home');
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
      console.error('Error submitting survey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowConfirmation = () => {
    // Navigate to confirmation page instead of showing modal
    navigate(`/quiz/${surveyId}/confirmation`, { 
      state: { 
        survey, 
        questions, 
        answers, 
        questionFlags 
      } 
    });
  };



  const toggleQuestionFlag = (questionId, flagType) => {
    setQuestionFlags(prev => ({
      ...prev,
      [questionId]: prev[questionId] === flagType ? null : flagType
    }));
  };

  const getQuestionStatus = (questionId) => {
    const answer = answers[questionId];
    const flag = questionFlags[questionId];
    
    if (flag === 'uncertain') return 'uncertain';
    if (flag === 'review') return 'review';
    if (answer !== undefined && answer !== '' && answer !== null) return 'answered';
    return 'unanswered';
  };



  const renderQuestion = (question) => {
    if (!question) return null;

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE_TEXT':
      case 'MULTIPLE_CHOICE_IMAGE':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={index}
                  checked={answers[question.questionId] === index}
                  onChange={() => handleOptionSelect(question.questionId, index)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.optionText}</span>
              </label>
            ))}
          </div>
        );

      case 'YES_NO':
        return (
          <div className="space-y-3">
            {['Yes', 'No'].map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={index}
                  checked={answers[question.questionId] === (index === 0)}
                  onChange={() => handleOptionSelect(question.questionId, index)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'RATING_SCALE_ICONS':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(question.questionId, rating)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                  answers[question.questionId] === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {rating === 1 ? '😞' : rating === 2 ? '😐' : rating === 3 ? '😊' : rating === 4 ? '😄' : '🤩'}
              </button>
            ))}
          </div>
        );

      case 'NUMERIC_SCALE':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(question.questionId, rating)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  answers[question.questionId] === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'FREE_TEXT':
        return (
          <textarea
            value={answers[question.questionId] || ''}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        );

      case 'DATE_PICKER':
        return (
          <input
            type="date"
            value={answers[question.questionId] || ''}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      default:
        return <p className="text-gray-500">Question type not supported</p>;
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" text="Loading quiz..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-red-300 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/user-home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!survey || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-gray-300 text-xl mb-4">No questions available for this survey</div>
          <button
            onClick={() => navigate('/user-home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const hasDeadline = survey?.deadline;
  const isExpired = hasDeadline && new Date(survey.deadline) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Quiz Content - Full Screen */}
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden w-full max-w-5xl">
                      {/* Quiz Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-6 relative">
              {/* Back Button - Top Left */}
              <button
                onClick={() => navigate('/user-home')}
                className="absolute top-4 left-4 text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                title="Return to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 text-center">
                  <h2 className="text-3xl font-bold mb-2">{survey.title}</h2>
                  {survey.description && (
                    <p className="text-blue-100 text-lg opacity-90">{survey.description}</p>
                  )}
                </div>
              </div>
            
            {/* Deadline Warning */}
            {hasDeadline && (
              <div className={`mb-4 p-3 rounded-lg border ${
                isExpired 
                  ? 'bg-red-500 bg-opacity-20 border-red-300 text-red-100' 
                  : 'bg-yellow-500 bg-opacity-20 border-yellow-300 text-yellow-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {isExpired ? 'Survey Expired' : 'Deadline'}
                  </span>
                  <span className="text-sm">{new Date(survey.deadline).toLocaleString()}</span>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-3 overflow-hidden border border-white border-opacity-20">
              <div 
                className="bg-gradient-to-r from-yellow-300 via-orange-400 to-green-400 h-2 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            
                         <div className="flex justify-between text-sm">
               <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
               <span className="font-semibold">{Math.round(progress)}% Complete</span>
             </div>


           </div>

           

          {/* Question Content */}
          <div className="p-6">
            {currentQuestion && (
              <div className="space-y-6">
                                 {/* Question Header */}
                 <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base">
                         {currentQuestionIndex + 1}
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">
                         {currentQuestion.subject || 'Question'}
                       </h3>
                     </div>
                     
                     {/* Flag Question Button */}
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => toggleQuestionFlag(currentQuestion.questionId, 'uncertain')}
                         className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           questionFlags[currentQuestion.questionId] === 'uncertain'
                             ? 'bg-yellow-500 text-white shadow-lg'
                             : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700'
                         }`}
                         title="Mark as uncertain"
                       >
                         <span className="text-lg">⚠</span>
                         <span>Uncertain</span>
                       </button>
                       
                       <button
                         onClick={() => toggleQuestionFlag(currentQuestion.questionId, 'review')}
                         className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           questionFlags[currentQuestion.questionId] === 'review'
                             ? 'bg-blue-500 text-white shadow-lg'
                             : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                         }`}
                         title="Mark for review"
                       >
                         <span className="text-lg">👁</span>
                         <span>Review Later</span>
                       </button>
                     </div>
                   </div>
                   
                   <p className="text-gray-700 text-base leading-relaxed">
                     {currentQuestion.questionText}
                   </p>
                   
                   {/* Question Status Info */}
                   <div className="mt-4 flex items-center justify-between text-sm">
                     <div className="flex items-center space-x-4">
                       <span className="text-gray-600">
                         Status: 
                         <span className={`ml-2 font-medium ${
                           questionFlags[currentQuestion.questionId] === 'uncertain' ? 'text-yellow-600' :
                           questionFlags[currentQuestion.questionId] === 'review' ? 'text-blue-600' :
                           answers[currentQuestion.questionId] !== undefined && 
                           answers[currentQuestion.questionId] !== '' && 
                           answers[currentQuestion.questionId] !== null ? 'text-green-600' : 'text-red-600'
                         }`}>
                           {questionFlags[currentQuestion.questionId] === 'uncertain' ? 'Marked as Uncertain' :
                            questionFlags[currentQuestion.questionId] === 'review' ? 'Marked for Review' :
                            answers[currentQuestion.questionId] !== undefined && 
                            answers[currentQuestion.questionId] !== '' && 
                            answers[currentQuestion.questionId] !== null ? 'Answered' : 'Not yet answered'}
                         </span>
                       </span>
                     </div>
                     
                     <div className="text-gray-500">
                       Question {currentQuestionIndex + 1} of {questions.length}
                     </div>
                   </div>
                 </div>

                                 {/* Answer Input */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   {renderQuestion(currentQuestion)}
                 </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={previousQuestion}
                    disabled={isFirstQuestion}
                    className={`px-6 py-2 ${isFirstQuestion ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  

                  {isLastQuestion ? (
                    <Button
                      onClick={handleShowConfirmation}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700"
                    >
                      Review & Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={nextQuestion}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Fixed Right Navigation Panel */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white border-opacity-20 p-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Questions</h3>
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>
        
        <div className="space-y-3">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question.questionId);
            const isCurrent = index === currentQuestionIndex;
            const hasFlag = questionFlags[question.questionId];
            
            return (
              <div
                key={question.questionId}
                className={`relative cursor-pointer transition-all duration-200 group ${
                  isCurrent ? 'scale-110' : 'hover:scale-105'
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {/* Question Number Circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${isCurrent ? 'ring-4 ring-yellow-300 shadow-lg' : ''}
                  ${status === 'answered' ? 'bg-green-500' : 
                    status === 'unanswered' ? 'bg-red-500' : 
                    status === 'uncertain' ? 'bg-yellow-500' : 
                    status === 'review' ? 'bg-blue-500' : 'bg-gray-400'}
                `}>
                  {index + 1}
                </div>
                
                {/* Flag Indicator */}
                {hasFlag && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shadow-lg">
                    {hasFlag === 'uncertain' ? (
                      <div className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center">⚠</div>
                    ) : hasFlag === 'review' ? (
                      <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">👁</div>
                    ) : null}
                  </div>
                )}
                
                {/* Hover Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {question.subject || `Question ${index + 1}`}
                  </div>
                  <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1"></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Status Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Answered</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unanswered</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Uncertain</span>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Review</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
