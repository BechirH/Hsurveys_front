"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import NavBar from '../components/common/NavBar';
import { apiService } from '../services/apiService';
import {
  Users,
  Building2,
  FileText,
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Settings,
  BarChart3,
  UserCheck,
  Globe,
  MapPin,
  Home,
  Bell,
  LogOut,
  ChevronDown,
  Eye,
  UserPlus,
  ShieldCheck,
  Users2,
  Loader2,
  AlertCircle,
  X,
  ClipboardList,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Check
} from "lucide-react";
import OverviewSection from '../components/dashboard/OverviewSection';
import { useOverviewData } from '../hooks/useOverviewData';
import SurveysSection from '../components/dashboard/SurveysSection';
import UsersSection from '../components/dashboard/UsersSection';
import OrganizationsSection from '../components/dashboard/OrganizationsSection';
import DepartmentsSection from '../components/dashboard/DepartmentsSection';
import TeamsSection from '../components/dashboard/TeamsSection';
import RolesSection from '../components/dashboard/RolesSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user: currentUser, token } = useSelector(state => state.auth);
  
  // Use the new overview data hook
  const {
    loading,
    error,
    organizations,
    departments,
    teams,
    users,
    surveys,
    roles,
    permissions,
    questions,
    surveyResponses,
    reload
  } = useOverviewData(currentUser);

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // API Base URLs
  const API_BASE_URL = "http://localhost:8080/api";
  const AUTH_API_URL = "http://localhost:8081/api";
  const ORG_API_URL = "http://localhost:8082/api";

  const dashboardStats = [
    {
      title: 'Organization',
      value: organizations[0]?.name || 'Loading...',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Your organization'
    },
    {
      title: 'Departments',
      value: departments.length,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'In your organization'
    },
    {
      title: 'Teams',
      value: teams.length,
      icon: Users2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Active teams'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: UserCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      description: 'In your organization'
    },
    {
      title: 'Active Surveys',
      value: surveys.filter(s => s.status === 'ACTIVE').length,
      icon: ClipboardList,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Currently running'
    },
    {
      title: 'Survey Responses',
      value: surveyResponses.length,
      icon: BarChart3,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Total submissions'
    }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'LOCKED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSurveyTypeColor = (type) => {
    switch (type) {
      case 'FEEDBACK': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'EXAM': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'ASSESSMENT': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCopyInvitationCode = async () => {
    try {
      await navigator.clipboard.writeText(organizations[0].id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy invitation code:', err);
    }
  };

  const onCreateSurvey = () => {
    // TODO: Implement survey creation modal or navigation
    alert('Create Survey clicked!');
  };

  const onAddUser = () => {
    // TODO: Implement add user modal or navigation
    alert('Add User clicked!');
  };

  const onCreateDepartment = () => {
    // TODO: Implement create department modal or navigation
    alert('Create Department clicked!');
  };

  const onCreateTeam = () => {
    // TODO: Implement create team modal or navigation
    alert('Create Team clicked!');
  };

  const onCreateRole = () => {
    // TODO: Implement create role modal or navigation
    alert('Create Role clicked!');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection
          stats={dashboardStats}
          organizations={organizations}
          surveys={surveys}
          users={users}
          getStatusColor={getStatusColor}
          getSurveyTypeColor={getSurveyTypeColor}
          setActiveTab={setActiveTab}
        />;
      case "surveys":
        return <SurveysSection
          surveys={surveys}
          getSurveyTypeColor={getSurveyTypeColor}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          onCreateSurvey={onCreateSurvey}
        />;
      case "users":
        return <UsersSection users={users} reload={reload} roles={roles} departments={departments} />;
      case "organizations":
        return <OrganizationsSection organizations={organizations} departments={departments} teams={teams} users={users} />;
      case "departments":
        return <DepartmentsSection departments={departments} teams={teams} users={users} onCreateDepartment={onCreateDepartment} />;
      case "teams":
        return <TeamsSection teams={teams} departments={departments} users={users} onCreateTeam={onCreateTeam} />;
      case "roles":
        return <RolesSection roles={roles} permissions={permissions} onCreateRole={onCreateRole} />;
      default:
        return <OverviewSection stats={dashboardStats} />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'surveys', name: 'Surveys', icon: ClipboardList },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'organizations', name: 'Organization', icon: Building2 },
    { id: 'departments', name: 'Departments', icon: Users2 },
    { id: 'teams', name: 'Teams', icon: Target },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your organization, users, surveys, and more
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4" />
                <span className="font-medium">Quick Action</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Invitation Code Card */}
          {organizations[0]?.id && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800">Invitation Code</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <code className="font-mono text-lg font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-xl select-all border">
                      {organizations[0].id}
                    </code>
                    <button
                      onClick={handleCopyInvitationCode}
                      className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all duration-200 hover:shadow-md"
                      title="Copy invitation code"
                    >
                      {copiedCode ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-medium">
                Share this code with new members to join your organization
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center text-red-800">
              <div className="bg-red-100 p-2 rounded-xl mr-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold">Error Loading Data</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">Loading Dashboard</h3>
                  <p className="text-gray-600 text-sm">Fetching your data...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;