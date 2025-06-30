import React from "react";
import { Building2, Edit } from "lucide-react";

const OrganizationsSection = ({ organizations, departments, teams, users }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Organization Information</h2>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {organizations.map((org) => (
        <div key={org.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-green-600 hover:text-green-900">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{org.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Departments: {departments.length}</p>
            <p>Teams: {teams.length}</p>
            <p>Users: {users.length}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default OrganizationsSection; 