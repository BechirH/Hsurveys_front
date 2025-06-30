import React from "react";
import { Shield, Edit, Trash2 } from "lucide-react";

const RolesSection = ({ roles, permissions, onCreateRole }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Role & Permission Management</h2>
      <button onClick={onCreateRole} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Shield className="w-4 h-4 mr-2" />
        Create Role
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Roles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{role.name}</p>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-green-600 hover:text-green-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Permissions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Permissions</h3>
        <div className="space-y-3">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{permission.name}</p>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-green-600 hover:text-green-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default RolesSection; 