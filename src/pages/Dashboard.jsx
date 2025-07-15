"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import NavBar from '../components/common/NavBar';
import { apiService } from '../services/apiService';
import QuestionsSection from '../components/dashboard/QuestionSection';

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
  AlertTriangle
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
  
  const { user: currentUser } = useSelector(state => state.auth);
  
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

  const [activeTab, setActiveTab] = useState("overview");

  const dashboardStats = [
    {
      title: 'Organization',
      value: organizations[0]?.name || 'Loading...',
      icon: Building2,
      color: 'bg-blue-500', // This will be used for the icon background only
      description: 'Your organization'
    },
    {
      title: 'Departments',
      value: departments.length,
      icon: Users,
      color: 'bg-green-500',
      description: 'In your organization'
    },
    {
      title: 'Teams',
      value: teams.length,
      icon: Users2,
      color: 'bg-purple-500',
      description: 'Active teams'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: UserCheck,
      color: 'bg-orange-500',
      description: 'In your organization'
    },
    {
      title: 'Active Surveys',
      value: surveys.filter(s => s.status === 'ACTIVE').length,
      icon: ClipboardList,
      color: 'bg-indigo-500',
      description: 'Currently running'
    },
    {
      title: 'Survey Responses',
      value: surveyResponses.length,
      icon: BarChart3,
      color: 'bg-pink-500',
      description: 'Total submissions'
    }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'LOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurveyTypeColor = (type) => {
    switch (type) {
      case 'FEEDBACK': return 'bg-blue-100 text-blue-800';
      case 'EXAM': return 'bg-purple-100 text-purple-800';
      case 'ASSESSMENT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const onCreateSurvey = () => {
    alert('Create Survey clicked!');
  };

  const onAddUser = () => {
    // TODO: Implement add user modal or navigation
    alert('Add User clicked!');
  };

  const onCreateDepartment = () => {
    alert('Create Department clicked!');
  };

  const onCreateTeam = () => {
    alert('Create Team clicked!');
  };

  const onCreateRole = async (roleData) => {
    try {
      const createdRole = await apiService.createRole({
        name: roleData.name,
        description: roleData.description
      });

      for (const permissionId of roleData.permissions) {
        await apiService.addPermissionToRole(createdRole.id, permissionId);
      }

      reload && reload(); 
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const onEditRole = async (roleData) => {
    try {
      // TODO: Implement edit role functionality
      reload && reload(); 
    } catch (error) {
      console.error('Error editing role:', error);
    }
  };

  const onDeleteRole = async (roleId) => {
    try {
      await apiService.deleteRole(roleId);
      reload && reload(); 
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // Early return for loading user
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'surveys', name: 'Surveys', icon: ClipboardList },
    { id: 'questions', name: 'Questions', icon: ClipboardList },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'organizations', name: 'Organization', icon: Building2 },
    { id: 'departments', name: 'Departments', icon: Users2 },
    { id: 'teams', name: 'Teams', icon: Target },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewSection
            stats={dashboardStats}
            organizations={organizations}
            surveys={surveys}
            users={users}
            getStatusColor={getStatusColor}
            getSurveyTypeColor={getSurveyTypeColor}
            setActiveTab={setActiveTab}
          />
        );
      case "surveys":
        return (
          <SurveysSection
            surveys={surveys}
            getSurveyTypeColor={getSurveyTypeColor}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onCreateSurvey={onCreateSurvey}
          />
        );
      case "questions":
        return (
          <QuestionsSection
            questions={questions}
            reload={reload} 
          />
        );
      case "users":
        return (
          <UsersSection 
            users={users} 
            roles={roles}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            reload={reload} 
          />
        );
      case "organizations":
        return (
          <OrganizationsSection 
            organizations={organizations} 
            departments={departments} 
            teams={teams} 
            users={users}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            reload={reload}
          />
        );
      case "departments":
        return (
          <DepartmentsSection
            departments={departments}
            onCreateDepartment={onCreateDepartment}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case "teams":
        return (
          <TeamsSection
            teams={teams}
            onCreateTeam={onCreateTeam}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case "roles":
        return (
          <RolesSection
            roles={roles}
            permissions={permissions}
            onCreateRole={onCreateRole}
            onEditRole={onEditRole}
            onDeleteRole={onDeleteRole}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      default:
        return (
          <OverviewSection 
            stats={dashboardStats}
            organizations={organizations}
            surveys={surveys}
            users={users}
            getStatusColor={getStatusColor}
            getSurveyTypeColor={getSurveyTypeColor}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {currentUser?.username}! Here's what's happening in your organization.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;