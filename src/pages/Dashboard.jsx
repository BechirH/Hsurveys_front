"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import NavBar from '../components/common/NavBar';
import DashboardLoading from '../components/common/DashboardLoading';
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
  const [copiedCode, setCopiedCode] = useState(false);
 
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
    
    alert('Create Survey clicked!');
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
            onCreateSurvey={onCreateSurvey}
            getStatusColor={getStatusColor}
            getSurveyTypeColor={getSurveyTypeColor}
            formatDate={formatDate}
          />
        );
      case "users":
        return (
          <UsersSection
            users={users}
            roles={roles}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case "organizations":
        return (
          <OrganizationsSection
            organizations={organizations}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
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
        return <OverviewSection />;
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {currentUser?.username}! Here's what's happening in your organization.
              </p>
            </div>
            
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "surveys", label: "Surveys", icon: FileText },
              { id: "users", label: "Users", icon: Users },
              { id: "organizations", label: "Organizations", icon: Building2 },
              { id: "departments", label: "Departments", icon: Users2 },
              { id: "teams", label: "Teams", icon: UserCheck },
              { id: "roles", label: "Roles", icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;