import React from "react";
const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="card-base hover:shadow-md transition-shadow duration-200">
    <div className="flex-between mb-3">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

export default StatCard; 