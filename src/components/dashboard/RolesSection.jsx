import React, { useState } from "react";
import { Shield, Edit, Trash2, Plus } from "lucide-react";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const RolesSection = ({ roles, permissions, onCreateRole, onEditRole, onDeleteRole }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAddRole = (roleData) => {
    onCreateRole(roleData);
  };

  const handleEditRole = (roleData) => {
    onEditRole(roleData);
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDeleteRole(selectedRole.id);
      setShowDeleteModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Role Management</h2>
          <p className="text-gray-600 mt-1">Manage roles and their assigned permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Role
        </button>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles</h3>
          
          {roles.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No roles created yet</h3>
              <p className="text-gray-500 mb-6">Create your first role to get started</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Create First Role
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                                             <div>
                         <h4 className="font-semibold text-gray-800">{role.name}</h4>
                         <p className="text-sm text-gray-500 mb-1">{role.description}</p>
                         <p className="text-xs text-gray-400">
                           {role.permissions?.length || 0} permissions assigned
                         </p>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditClick(role)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Edit role"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(role)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        permissions={permissions}
        onSave={handleAddRole}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        role={selectedRole}
        permissions={permissions}
        onSave={handleEditRole}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        entity={selectedRole}
        entityType="role"
      />
    </div>
  );
};

export default RolesSection; 