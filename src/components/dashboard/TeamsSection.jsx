import React from "react";
import { Plus, Users2, Eye, Edit, UserPlus } from "lucide-react";

const TeamsSection = ({ teams, departments, users, onCreateTeam }) => (
  <div className="space-y-6">
    <div className="flex-between">
      <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
      <button onClick={onCreateTeam} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Create Team
      </button>
    </div>
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header-base">Team</th>
              <th className="table-header-base">Department</th>
              <th className="table-header-base">Members</th>
              <th className="table-header-base">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="table-cell-base">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex-center mr-3">
                      <Users2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                  </div>
                </td>
                <td className="table-cell-base text-sm text-gray-500">
                  {departments.find(dept => dept.id === team.departmentId)?.name || 'Unknown'}
                </td>
                <td className="table-cell-base text-sm text-gray-500">
                  {users.filter(user => user.teamId === team.id).length}
                </td>
                <td className="table-cell-base text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="icon-btn">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="icon-btn-green">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="icon-btn-orange">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default TeamsSection; 