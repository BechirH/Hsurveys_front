import React, { useState } from 'react';
import { Users, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../common/Button';

const UserAssignmentModal = ({
  isOpen,
  onClose,
  users,
  currentAssignments = [],
  onAssign,
  title = "Assign Users",
  type = "team", // or "department"
  isEditing = false // New prop to indicate edit mode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(currentAssignments);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  if (!isOpen) return null;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card-base w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-header text-lg">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowUserDropdown(true)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  {showUserDropdown ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {showUserDropdown && filteredUsers.length > 0 && (
              <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                      selectedUsers.includes(user.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Users ({selectedUsers.length})
              </label>
              {selectedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md min-h-12">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <div
                        key={userId}
                        className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200"
                      >
                        <span className="mr-2 text-sm">{user.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUserSelection(userId);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 text-gray-500 text-sm rounded-md">
                  No users selected
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary">{isEditing ? 'Update Assignments' : 'Assign Users'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAssignmentModal;