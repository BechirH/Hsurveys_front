import React, { useState,useEffect  } from "react";
import QuestionForm from "../survey/QuestionForm";
import { questionService } from "../../services/questionService";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditQuestionFullModal from "./EditQuestionFullModal";
import ViewQuestionModal from "./ViewQuestionModal";
import LockQuestionModal from "./LockQuestionModal";
import CreateQuestionFullModal from "./CreateQuestionFullModal";

import { Eye, Edit, Lock, Unlock, Plus } from "lucide-react";
import Button from "../common/Button";

const QuestionsSection = ({ questions = [], reload }) => {
  console.log("Questions prop:", questions);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [localQuestions, setLocalQuestions] = useState(questions);
  // États pour le modal de visualisation
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [questionToView, setQuestionToView] = useState(null);
  // États pour le modal d'édition
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  // États pour le modal de lock/unlock
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [questionToLock, setQuestionToLock] = useState(null);
  const [lockLoading, setLockLoading] = useState(false);
  // États pour le modal de suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fonctions pour gérer la visualisation
  const handleViewClick = (question) => {
    setQuestionToView(question);
    setViewModalOpen(true);
  };

  const handleViewClose = () => {
    setViewModalOpen(false);
    setQuestionToView(null);
  };

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

  // Fonctions pour gérer l'édition
  const handleEditClick = (question) => {
    setQuestionToEdit(question);
    setEditModalOpen(true);
  };

  const handleEditSave = async (formData) => {
    if (!questionToEdit) return;
    
    setEditLoading(true);
    try {
      const updatedQuestion = await questionService.updateQuestion(questionToEdit.id || questionToEdit.questionId, formData);
      setLocalQuestions(prev => prev.map(q => (q.id === (questionToEdit.id || questionToEdit.questionId) || q.questionId === (questionToEdit.id || questionToEdit.questionId)) ? updatedQuestion : q));
      setEditModalOpen(false);
      setQuestionToEdit(null);
    } catch (err) {
      console.error("Erreur lors de la modification de la question :", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setQuestionToEdit(null);
  };

  // Fonctions pour gérer la suppression
  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    
    setDeleteLoading(true);
    try {
      await questionService.deleteQuestion(questionToDelete.id || questionToDelete.questionId);
      setLocalQuestions(prev => prev.filter(q => (q.id || q.questionId) !== (questionToDelete.id || questionToDelete.questionId)));
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error('Error deleting the question:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  // Fonctions pour gérer le lock/unlock
  const handleLockClick = (question) => {
    setQuestionToLock(question);
    setLockModalOpen(true);
  };

  const handleLockConfirm = async () => {
    if (!questionToLock) return;
    
    setLockLoading(true);
    try {
      // Ici vous devrez implémenter l'appel API pour lock/unlock
      // const updatedQuestion = await questionService.toggleLock(questionToLock.id || questionToLock.questionId);
      // setLocalQuestions(prev => prev.map(q => (q.id === (questionToLock.id || questionToLock.questionId) || q.questionId === (questionToLock.id || questionToLock.questionId)) ? updatedQuestion : q));
      
      // Pour l'instant, on simule la mise à jour
      setLocalQuestions(prev => prev.map(q => {
        if ((q.id === (questionToLock.id || questionToLock.questionId) || q.questionId === (questionToLock.id || questionToLock.questionId))) {
          return { ...q, locked: !q.locked };
        }
        return q;
      }));
      
      setLockModalOpen(false);
      setQuestionToLock(null);
    } catch (err) {
      console.error('Error toggling lock status:', err);
    } finally {
      setLockLoading(false);
    }
  };

  const handleLockCancel = () => {
    setLockModalOpen(false);
    setQuestionToLock(null);
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
    <React.Fragment key={question.id || question.questionId}>
      <tr className="hover:bg-gray-50">
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
            <button className="icon-btn" aria-label="View question details" onClick={() => handleViewClick(question)}>
              <Eye className="w-4 h-4" />
            </button>
            <button className="icon-btn-green" aria-label="Edit this question" onClick={() => handleEditClick(question)}>
              <Edit className="w-4 h-4" />
            </button>
            <button className="icon-btn-red" aria-label="Delete this question" onClick={() => handleDeleteClick(question)}>
              {/* Trash icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012 2v2" /></svg>
            </button>
            <button
              className="text-orange-600 hover:text-orange-900"
              aria-label={question.locked ? "Unlock the question" : "Lock the question"}
              onClick={() => handleLockClick(question)}
            >
              {question.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
        </td>
      </tr>
    </React.Fragment>
  ))}
</tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end">
      <Button
        icon={Plus}
        onClick={() => setCreateModalOpen(true)}
        variant="primary"
      >
        Créer une question
      </Button>

    </div>
    
    {/* Modal de visualisation */}
    <ViewQuestionModal
      open={viewModalOpen}
      onClose={handleViewClose}
      question={questionToView}
    />
    
    {/* Modal d'édition */}
    <EditQuestionFullModal
      open={editModalOpen}
      onClose={handleEditCancel}
      onSave={handleEditSave}
      loading={editLoading}
      question={questionToEdit}
    />
    
    {/* Modal de lock/unlock */}
    <LockQuestionModal
      open={lockModalOpen}
      onClose={handleLockCancel}
      onConfirm={handleLockConfirm}
      loading={lockLoading}
      question={questionToLock}
    />
    
    {/* Modal de confirmation de suppression */}
    <DeleteConfirmationModal
      open={deleteModalOpen}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      loading={deleteLoading}
      entity={questionToDelete}
      entityType="question"
    />
    <CreateQuestionFullModal
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onCreate={async (formData) => {
        await handleSubmitQuestion(formData);
        setCreateModalOpen(false);
      }}
      loading={false}
    />
    </div>
  );
};

export default QuestionsSection;
