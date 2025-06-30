import React from "react";

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <div className={`rounded-lg shadow-md p-6 flex flex-col items-center ${color}`}>
    <div className="mb-2">
      <Icon size={32} />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-lg">{title}</div>
    <div className="text-sm text-gray-200">{description}</div>
  </div>
);

export default StatCard; 