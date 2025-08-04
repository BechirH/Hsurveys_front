import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Lock, Unlock, Search, Trash2, ImageOff } from "lucide-react";
import Button from "../common/Button";
import { questionService } from "../../services/questionService";
import CreateQuestionModal from "./CreateQuestionModal";
import EditQuestionModal from "./EditQuestionModal";
import LockConfirmationModal from "./LockConfirmationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ClipboardList } from "lucide-react"; 

const QuestionsSection = ({ reload }) => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [questionToToggleLock, setQuestionToToggleLock] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await questionService.getAllQuestions();
        setQuestions(res);
      } catch (err) {
        console.error("Error while fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [reload]);

  const handleEditQuestion = async (updatedData) => {
    try {
      const updated = await questionService.updateQuestion(updatedData.questionId, updatedData);
      setQuestions((prev) =>
        prev.map((q) => (q.questionId === updated.questionId ? updated : q)));
      setShowEditModal(false);
      setEditQuestion(null);
    } catch (err) {
      console.error("Error updating question:", err);
    }};

  const handleSubmitQuestion = async (formData) => {
    try {
      const created = await questionService.createQuestion(formData);
      setQuestions((prev) => [...prev, created]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating question:", err);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q =>
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, questions]);

  const handleToggleLockQuestion = async (questionId, isCurrentlyLocked) => {
  try {
    if (isCurrentlyLocked) {
      await questionService.unlockQuestion(questionId);
    } else {
      await questionService.lockQuestion(questionId);
    }

    setQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, locked: !isCurrentlyLocked } : q
      )
    );
  } catch (error) {
    console.error("Error toggling question lock:", error);
  }};

  const handleDeleteQuestion = async (questionId) => {
    try {
      setLoadingDelete(true);
      await questionService.deleteQuestion(questionId);  
      setQuestions((prev) => prev.filter(q => q.questionId !== questionId));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setLoadingDelete(false);
    }};

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
              <ClipboardList className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Question Management</h2>
                <p className="text-sm text-gray-500">Manage your list of questions</p>
              </div>
            </div>
          <Button
          icon={Plus}
          variant="primary"  
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
          onClick={() => setShowCreateModal((prev) => !prev)}>
            {showCreateModal ? "Cancel" : "Create Question"}
          </Button>
        </div>

        {/* Search + Total */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredQuestions.length} result{filteredQuestions.length !== 1 && "s"} • {questions.length} total
          </div>
        </div>
      </div>

      {/* List of questions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No questions found.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id || q.questionId}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:shadow transition flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{q.subject}</h3>
                  <p className="text-[20px] text-gray-800 mt-1">{q.questionText}</p>

                </div>
                <div className="flex items-center gap-2">
                  <button
                  className="icon-btn-green"
                  title="Edit"
                  onClick={() => {
                    setEditQuestion(q);
                    setShowEditModal(true);
                    }}>
                      <Edit className="w-4 h-4" />
                  </button>
                  <button
                  className="text-orange-600 hover:text-orange-900"
                  title={q.locked ? "Unlock" : "Lock"}
                  onClick={() => {
                    setQuestionToToggleLock(q);
                    setShowLockModal(true);
                    }}>
                  {q.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                  onClick={() => {
                    setQuestionToDelete(q);
                    setShowDeleteModal(true);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {q.options?.length > 0 && (
                <ul className="list-disc list-inside text-[17px] text-gray-800 space-y-1">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>
                      {opt.optionText} ({opt.optionScore})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      <CreateQuestionModal
      open={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      onSubmit={handleSubmitQuestion}
      />

      <EditQuestionModal
      open={showEditModal}
      onClose={() => setShowEditModal(false)}
      question={editQuestion}
      onSubmit={handleEditQuestion}
      />

      <LockConfirmationModal
      open={showLockModal}
      onClose={() => {
        setShowLockModal(false);
        setQuestionToToggleLock(null);
      }}
      onConfirm={async () => {
        if (!questionToToggleLock) return;
        const id = questionToToggleLock.questionId;
        const locked = questionToToggleLock.locked;
        setShowLockModal(false);
        try {
          await handleToggleLockQuestion(id, locked);
        } finally {
          setQuestionToToggleLock(null);
        }
      }}
      loading={loading}
      entity={questionToToggleLock}
      entityType="question"/>

      <DeleteConfirmationModal
      open={showDeleteModal}
      onClose={() => {
        setShowDeleteModal(false);
        setQuestionToDelete(null);
      }}
      onConfirm={async () => {
        if (!questionToDelete) return;
        await handleDeleteQuestion(questionToDelete.questionId);
      }}
      loading={loadingDelete}
      entity={questionToDelete}
      entityType="question"
      />

    </div>
  );
};

export default QuestionsSection;
