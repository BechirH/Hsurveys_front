import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { apiService } from '../../services/apiService';
import Button from '../common/Button';
import { useSelector } from 'react-redux';

const AssignRoleModal = ({ open, user, onClose, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (open) {
      apiService.getRoles().then((allRoles) => {
        setRoles(allRoles);
        // Map user.roles (names) to role IDs
        if (user?.roles && Array.isArray(user.roles)) {
          const assignedRoleIds = allRoles
            .filter(r => user.roles.includes(r.name))
            .map(r => r.id);
          setSelectedRoles(assignedRoleIds);
        } else {
          setSelectedRoles([]);
        }
      }).catch(() => setRoles([]));
      apiService.getDepartments().then((allDepartments) => {
        setDepartments(allDepartments);
        setSelectedDepartment(user?.department || '');
      }).catch(() => setDepartments([]));
    }
  }, [open, user]);

  const handleRoleChange = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Map user.roles (names) to role IDs for comparison
      const currentRoleIds = roles
        .filter(r => (user.roles || []).includes(r.name))
        .map(r => r.id);
      const toAdd = selectedRoles.filter((r) => !currentRoleIds.includes(r));
      const toRemove = currentRoleIds.filter((r) => !selectedRoles.includes(r));
      await Promise.all([
        ...toAdd.map((roleId) => apiService.assignRoleToUser(user.id, roleId)),
        ...toRemove.map((roleId) => apiService.removeRoleFromUser(user.id, roleId)),
        apiService.updateUser(user.id, { department: selectedDepartment }),
      ]);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update roles or department.');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-xl font-bold">{user.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Assign Roles to {user.username}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="text-gray-600 text-sm mb-2">Check a role to assign, uncheck to remove.</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.length === 0 && <div className="text-gray-500 col-span-2">No roles available.</div>}
            {roles.map((role) => (
              <label key={role.id} className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${selectedRoles.includes(role.id) ? 'bg-purple-50 border-purple-400' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}`}>
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  className="form-checkbox accent-purple-600 mr-3"
                />
                <span className="font-medium text-gray-800">{role.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-6">
            <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">Assign Department</label>
            <select
              id="department-select"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-800"
            >
              <option value="">Not assigned</option>
              {departments.map((dept) => (
                <option key={dept.id || dept._id || dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          {error && <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mt-2 text-sm animate-fade-in">{error}</div>}
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex space-x-2">
            <Button type="button" variant="secondary" onClick={onClose} label="Cancel" className="flex-1" />
            <Button type="submit" variant="primary" loading={loading} label="Save Changes" className="flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal; 