"use client";
import React, { useState, useEffect } from "react";
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
  AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user: currentUser, token } = useSelector(state => state.auth);
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data states
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [surveyResponses, setSurveyResponses] = useState([]);

  // API Base URLs
  const API_BASE_URL = "http://localhost:8080/api";
  const AUTH_API_URL = "http://localhost:8081/api";
  const ORG_API_URL = "http://localhost:8082/api";

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel - backend handles organization filtering
      await Promise.all([
        loadOrganization(),
        loadDepartments(),
        loadTeams(),
        loadUsers(),
        loadSurveys(),
        loadRoles(),
        loadPermissions(),
        loadQuestions(),
        loadSurveyResponses()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // API Functions - Backend handles organization filtering
  const loadOrganization = async () => {
    try {
      const data = await apiService.getCurrentOrganization();
      setOrganizations([data]);
    } catch (err) {
      console.error('Failed to load organization:', err);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const loadTeams = async () => {
    try {
      const data = await apiService.getTeams();
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadSurveys = async () => {
    try {
      const data = await apiService.getSurveys();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to load surveys:', err);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await apiService.getRoles();
      setRoles(data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await apiService.getPermissions();
      setPermissions(data);
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const loadQuestions = async () => {
    try {
      const data = await apiService.getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  const loadSurveyResponses = async () => {
    try {
      const data = await apiService.getSurveyResponses();
      setSurveyResponses(data);
    } catch (err) {
      console.error('Failed to load survey responses:', err);
    }
  };

  // Dashboard Stats - Organization Scoped
  const dashboardStats = [
    {
      title: 'Organization',
      value: organizations[0]?.name || 'Loading...',
      icon: Building2,
      color: 'bg-blue-500',
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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
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

  const renderOverview = () => (
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
        {dashboardStats.map((stat, index) => (
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
              onClick={() => setActiveTab('surveys')}
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
              onClick={() => setActiveTab('users')}
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

  const renderSurveys = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Survey Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                      <div className="text-sm text-gray-500">{survey.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSurveyTypeColor(survey.type)}`}>
                      {survey.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                      {survey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {survey.deadline ? formatDate(survey.deadline) : 'No deadline'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900">
                        {survey.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
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

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {user.roles?.join(', ') || 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900">
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

  const renderOrganizations = () => (
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

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Department Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teams.filter(team => team.departmentId === dept.id).length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {users.filter(user => user.departmentId === dept.id).length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900">
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

  const renderTeams = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Users2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {departments.find(dept => dept.id === team.departmentId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {users.filter(user => user.teamId === team.id).length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900">
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

  const renderRoles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Role & Permission Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'surveys':
        return renderSurveys();
      case 'users':
        return renderUsers();
      case 'organizations':
        return renderOrganizations();
      case 'departments':
        return renderDepartments();
      case 'teams':
        return renderTeams();
      case 'roles':
        return renderRoles();
      default:
        return renderOverview();
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your organization, users, surveys, and more</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
