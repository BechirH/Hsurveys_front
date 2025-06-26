import React from "react";
import Button from '../common/Button';

const DepartmentModal = ({
  editingDepartment,
  departmentForm,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card-base w-full max-w-md">
        <h2 className="section-header mb-4">
          {editingDepartment ? 'Edit Department' : 'Create New Department'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name*
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={departmentForm.name}
              onChange={(e) =>
                onChange({ ...departmentForm, name: e.target.value })
              }
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{editingDepartment ? 'Update Department' : 'Create Department'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
