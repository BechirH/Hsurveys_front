// MOVE FILE to src/components/modals/TeamModal.jsx

// TeamModal.jsx
import React from "react";
import Button from '../common/Button';

const TeamModal = ({
  editingTeam,
  teamForm,
  departments,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card-base w-full max-w-md">
        <h2 className="section-header mb-4">
          {editingTeam ? 'Edit Team' : 'Create New Team'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name*</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={teamForm.name}
              onChange={(e) => onChange({ ...teamForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={teamForm.department}
              onChange={(e) => onChange({ ...teamForm, department: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{editingTeam ? 'Update Team' : 'Create Team'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
