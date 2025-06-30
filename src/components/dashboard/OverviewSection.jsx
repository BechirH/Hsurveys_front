import React from "react";
import StatCard from "./StatCard";
import { Building2 } from "lucide-react";

const OverviewSection = ({
  stats,
  organizations = [],
  surveys = [],
  users = [],
  getStatusColor,
  getSurveyTypeColor,
  setActiveTab
}) => (
  <div className="space-y-8">
    {/* Organization Info */}
    {organizations[0] && (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{organizations[0].name}</h2>
        </div>
        <p className="text-blue-100">Organization Dashboard - Manage your departments, teams, users, and surveys</p>
      </div>
    )}

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Surveys */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Surveys</h2>
          <button
            onClick={() => setActiveTab && setActiveTab('surveys')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {surveys.slice(0, 5).map((survey) => (
            <div key={survey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{survey.title}</p>
                <p className="text-sm text-gray-500">{survey.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                {survey.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
          <button
            onClick={() => setActiveTab && setActiveTab('users')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {users.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default OverviewSection; 