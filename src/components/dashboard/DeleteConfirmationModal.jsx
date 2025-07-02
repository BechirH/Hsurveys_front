import React from 'react';
import { X, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, loading, user }) => {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Delete User</h3>
            <p className="text-gray-500 text-sm">Are you sure you want to delete <span className="font-semibold">{user.username}</span>?</p>
          </div>
        </div>
        <div className="text-red-600 text-sm mb-4">This action cannot be undone.</div>
        <div className="flex space-x-2 mt-4">
          <button type="button" className="flex-1 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full inline-block"></span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 