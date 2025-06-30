import React from "react";
import { Plus, Users, Eye, Edit, UserPlus } from "lucide-react";

const DepartmentsSection = ({ departments, teams, users, onCreateDepartment }) => (
  <div className="space-y-6">
    <div className="flex-between">
      <h2 className="text-2xl font-bold text-gray-800">Department Management</h2>
      <button onClick={onCreateDepartment} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Create Department
      </button>
    </div>
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header-base">Department</th>
              <th className="table-header-base">Teams</th>
              <th className="table-header-base">Members</th>
              <th className="table-header-base">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="table-cell-base">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex-center mr-3">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                  </div>
                </td>
                <td className="table-cell-base text-sm text-gray-500">
                  {teams.filter(team => team.departmentId === dept.id).length}
                </td>
                <td className="table-cell-base text-sm text-gray-500">
                  {users.filter(user => user.departmentId === dept.id).length}
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

export default DepartmentsSection; 