"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import TeamModal from '../components/modals/TeamModal';
import DepartmentModal from '../components/modals/DepartmentModal';
import UserAssignmentModal from '../components/modals/UserAssignmentModal';
import Button from '../components/common/Button';
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
  X
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user: currentUser, logout: handleLogout } = useAuth();
  // The rest of the state (organizations, surveys, etc.) can still use local state or be migrated to Redux as needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showUserAssignmentModal, setShowUserAssignmentModal] = useState(false);
  const [assignmentTarget, setAssignmentTarget] = useState(null);
  const [assignmentType, setAssignmentType] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    department: '',
    members: []
  });
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    status: 'Active'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Optionally, you can load other data from Redux or API here
  // useEffect(() => { ... }, []);

  if (!currentUser) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const handleAssignUsers = (targetId, type) => {
    setAssignmentTarget(targetId);
    setAssignmentType(type);
    setShowUserAssignmentModal(true);
  };

  const handleUserAssignmentSubmit = (userIds) => {
    if (assignmentType === 'team') {
      const team = teams.find(t => t.id === assignmentTarget);
      if (!team) return;
      
      // 1. Update team members
      const updatedTeams = teams.map(t => 
        t.id === assignmentTarget ? { ...t, members: userIds } : t
      );
      
      // 2. Update user's department field
      const updatedUsers = users.map(user => 
        userIds.includes(user.id) 
          ? { ...user, department: team.department }
          : user
      );
      
      setTeams(updatedTeams);
      setUsers(updatedUsers);
      
    } else if (assignmentType === 'department') {
      const department = departments.find(d => d.id === assignmentTarget);
      if (!department) return;
      
      // 1. Update department members (if tracking separately)
      const updatedDepartments = departments.map(d => 
        d.id === assignmentTarget ? { ...d, members: userIds } : d
      );
      
      // 2. Update user's department field
      const updatedUsers = users.map(user => 
        userIds.includes(user.id)
          ? { ...user, department: department.name }
          : user
      );
      
      setDepartments(updatedDepartments);
      setUsers(updatedUsers);
    }
    
    setShowUserAssignmentModal(false);
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    
    if (editingTeam) {
      const updatedTeams = teams.map(team => 
        team.id === editingTeam.id 
          ? { ...team, ...teamForm, members: selectedUsers }
          : team
      );
      
      // Update user departments
      const updatedUsers = users.map(user => 
        selectedUsers.includes(user.id)
          ? { ...user, department: teamForm.department }
          : user
      );
      
      setTeams(updatedTeams);
      setUsers(updatedUsers);
    } else {
      const newTeam = {
        id: Date.now(),
        ...teamForm,
        members: selectedUsers,
        createdAt: new Date().toISOString()
      };
      
      // Update user departments
      const updatedUsers = users.map(user => 
        selectedUsers.includes(user.id)
          ? { ...user, department: teamForm.department }
          : user
      );
      
      setTeams([...teams, newTeam]);
      setUsers(updatedUsers);
    }
    
    setTeamForm({ name: '', department: '', members: [] });
    setSelectedUsers([]);
    setEditingTeam(null);
    setShowTeamModal(false);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      department: team.department,
      members: team.members
    });
    setSelectedUsers(team.members || []);
    setShowTeamModal(true);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const handleDepartmentSubmit = (e) => {
    e.preventDefault();
    
    if (editingDepartment) {
      setDepartments(departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, name: departmentForm.name }
          : dept
      ));
    } else {
      const newDepartment = {
        id: Date.now(),
        name: departmentForm.name,
        createdAt: new Date().toISOString()
      };
      setDepartments([...departments, newDepartment]);
    }
    
    setDepartmentForm({ name: '' });
    setEditingDepartment(null);
    setShowDepartmentModal(false);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name
    });
    setShowDepartmentModal(true);
  };

  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId));
    }
  };

  const handleRemoveUser = (userId, targetId, type) => {
    if (type === 'team') {
      setTeams(teams.map(team => 
        team.id === targetId
          ? { 
              ...team, 
              members: (team.members || []).filter(id => id !== userId) 
            }
          : team
      ));

      // Check if user needs department update
      const userTeams = teams.filter(t => 
        (t.members || []).includes(userId) && 
        t.department === teams.find(t => t.id === targetId)?.department
      );
      
      if (userTeams.length === 0) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, department: '' } : u
        ));
      }
      
    } else if (type === 'department') {
      const dept = departments.find(d => d.id === targetId);
      
      // 1. Remove from department members (with null check)
      setDepartments(departments.map(d => 
        d.id === targetId
          ? { 
              ...d, 
              members: (d.members || []).filter(id => id !== userId) 
            }
          : d
      ));
      
      // 2. Remove from all teams in this department (with null check)
      setTeams(teams.map(team => 
        team.department === dept?.name
          ? { 
              ...team, 
              members: (team.members || []).filter(id => id !== userId) 
            }
          : team
      ));
      
      // 3. Clear user's department field
      setUsers(users.map(u => 
        u.id === userId ? { ...u, department: '' } : u
      ));
    }
  };

  // Permissions
  const isGlobalAdmin = currentUser?.role === "Global Admin";
  const isRegionalAdmin = isGlobalAdmin || currentUser?.role === "Regional Admin";
  const isLocalAdmin = isRegionalAdmin || currentUser?.role === "Local Admin";

  const canManageSurveys = isLocalAdmin;
  const canManageUsers = isLocalAdmin;
  const canManageRoles = isRegionalAdmin;
  const canManageOrganizations = isGlobalAdmin;
  const canManageTeams = isLocalAdmin;

  const getAvailableTabs = () => {
    const tabs = [{ id: "overview", label: "Overview", icon: BarChart3 }];
    if (canManageSurveys) tabs.push({ id: "surveys", label: "Surveys", icon: FileText });
    if (canManageUsers) tabs.push({ id: "users", label: "Users", icon: Users });
    if (canManageTeams) tabs.push({ id: "teams", label: "Teams", icon: Users2 });
    if (canManageRoles) tabs.push({ id: "roles", label: "Roles", icon: Shield });
    if (canManageOrganizations) tabs.push({ id: "organizations", label: "Organizations", icon: Building2 });
    if (isRegionalAdmin) tabs.push({ id: "departments", label: "Departments", icon: Building2 });
    return tabs;
  };

  // Component helpers
  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="card-base">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
              {change > 0 ? "+" : ""}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Render functions
  const renderTeams = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-header">Teams</h2>
        <Button
          icon={Plus}
          label="Create Team"
          onClick={() => {
            setEditingTeam(null);
            setTeamForm({ name: '', department: '', members: [] });
            setSelectedUsers([]);
            setShowTeamModal(true);
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const assignedSurveys = surveys.filter((survey) =>
            survey.assignedTo?.includes(team.id)
          );
          return (
            <div key={team.id} className="card-base">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    className="icon-btn"
                    onClick={() => handleEditTeam(team)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="icon-btn-purple"
                    onClick={() => handleAssignUsers(team.id, 'team')}
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button 
                    className="icon-btn-red"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Department:</p>
                  <p className="text-sm text-gray-900">{team.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Members ({team.members.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {users
                      .filter((u) => team.members.includes(u.id))
                      .slice(0, 5)
                      .map((user) => (
                        <span key={user.id} className="tag-base tag-gray">
                          {user.name}
                        </span>
                      ))}
                    {team.members.length > 5 && (
                      <span className="tag-base tag-gray">
                        +{team.members.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Assigned Surveys ({assignedSurveys.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {assignedSurveys.slice(0, 3).map((survey) => (
                      <span key={survey.id} className="tag-base tag-blue">
                        {survey.title}
                      </span>
                    ))}
                    {assignedSurveys.length > 3 && (
                      <span className="tag-base tag-blue">
                        +{assignedSurveys.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {canManageSurveys && (
          <StatCard
            title="Active Surveys"
            value={surveys.filter((s) => s.status === "Active").length}
            icon={FileText}
            color="bg-blue-500"
            change={8}
          />
        )}
        {canManageUsers && (
          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="bg-green-500"
            change={3}
          />
        )}
        {canManageTeams && (
          <StatCard
            title="Active Teams"
            value={teams.length}
            icon={Users2}
            color="bg-indigo-500"
            change={2}
          />
        )}
        {canManageRoles && (
          <StatCard
            title="Roles Managed"
            value={roles.length}
            icon={Shield}
            color="bg-purple-500"
            change={0}
          />
        )}
        {isRegionalAdmin && (
          <StatCard
            title="Departments"
            value={[...new Set(teams.map((team) => team.department))].length}
            icon={Building2}
            color="bg-orange-500"
            change={0}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New survey created
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Users2 className="w-4 h-4 text-green-600" />{" "}
                {/* Updated icon */}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Team members updated
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Permissions granted
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {canManageSurveys && (
              <Button
                icon={Plus}
                label="Create New Survey"
                onClick={() => console.log("Create survey")}
              />
            )}
            {canManageTeams && ( // NEW: Team action button
              <Button
                icon={Users2}
                label="Create New Team"
                onClick={() => console.log("Create team")}
                variant="secondary"
              />
            )}
            {canManageUsers && (
              <Button
                icon={UserPlus}
                label="Add New User"
                onClick={() => console.log("Add user")}
                variant="secondary"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurveys = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-header">
          Surveys
        </h2>
        <Button
          icon={Plus}
          label="Create Survey"
          onClick={() => console.log("Create survey")}
        />
      </div>

      <div className="card-base">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header-base">Survey</th>
              <th className="table-header-base">Department</th>
              <th className="table-header-base">Assigned To</th>
              <th className="table-header-base">Responses</th>
              <th className="table-header-base">Status</th>
              <th className="table-header-base">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surveys.map((survey) => (
              <tr key={survey.id}>
                <td className="table-cell-base">
                  <div className="text-sm font-medium text-gray-900">
                    {survey.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {survey.created}
                  </div>
                </td>
                <td className="table-cell-base text-sm text-gray-900">
                  {survey.department}
                </td>
                <td className="table-cell-base">
                  <div className="flex flex-wrap gap-1">
                    {survey.assignedTo?.map((teamId) => {
                      const team = teams.find((t) => t.id === teamId);
                      return team ? (
                        <span
                          key={teamId}
                          className="tag-base tag-blue"
                        >
                          {team.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </td>
                <td className="table-cell-base text-sm text-gray-900">
                  {survey.responses}
                </td>
                <td className="table-cell-base">
                  <span
                    className={`tag-base ${
                      survey.status === "Active"
                        ? "tag-green"
                        : survey.status === "Draft"
                        ? "tag-yellow"
                        : "tag-gray"
                    }`}
                  >
                    {survey.status}
                  </span>
                </td>
                <td className="table-cell-base text-sm font-medium space-x-2">
                  <button className="icon-btn">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="icon-btn">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="icon-btn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-header">
          Organization Users
        </h2>
        <Button
          icon={UserPlus}
          label="Assign User"
          onClick={() => console.log("Assign user")}
        />
      </div>

      <div className="card-base">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header-base">User</th>
              <th className="table-header-base">Role</th>
              <th className="table-header-base">Department</th>
              <th className="table-header-base">Teams</th>{" "}
              {/* NEW COLUMN */}
              <th className="table-header-base">Status</th>
              <th className="table-header-base">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="table-cell-base">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="table-cell-base text-sm text-gray-900">
                  {user.role}
                </td>
                <td className="table-cell-base text-sm text-gray-900">
                  {user.department}
                </td>
                <td className="table-cell-base">
                  <div className="flex flex-wrap gap-1">
                    {teams
                      .filter((t) => t.members.includes(user.id))
                      .map((team) => (
                        <span
                          key={team.id}
                          className="tag-base tag-gray"
                        >
                          {team.name}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="table-cell-base">
                  <span
                    className={`tag-base ${
                      user.status === "Active"
                        ? "tag-green"
                        : "tag-red"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="table-cell-base text-sm font-medium space-x-2">
                  <button className="icon-btn">
                    <Shield className="w-4 h-4" />
                  </button>
                  <button className="icon-btn">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="icon-btn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-header">Roles</h2>
        <Button
          icon={Plus}
          label="Create Role"
          onClick={() => console.log("Create role")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="card-base"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {role.name}
              </h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {role.users} users assigned
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Permissions:</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {permission.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDepartments = () => {
    const departmentsWithStats = departments.map(dept => {
      const deptTeams = teams.filter(team => team.department === dept.name);
      
      // Get members from users who have this department set
      const deptMembers = users
        .filter(user => user.department === dept.name)
        .map(user => user.id);
      
      return {
        ...dept,
        teamCount: deptTeams.length,
        members: deptMembers,
        memberCount: deptMembers.length,
        surveyCount: surveys.filter(survey => 
          deptTeams.some(team => survey.assignedTo?.includes(team.id))
        ).length
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
          {isGlobalAdmin && (
            <Button
              icon={Plus}
              label="Add Department"
              onClick={() => {
                setEditingDepartment(null);
                setDepartmentForm({ name: ''});
                setShowDepartmentModal(true);
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsWithStats.map((dept) => (
            <div key={dept.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                {isGlobalAdmin && (
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleAssignUsers(dept.id, 'department')}
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => handleEditDepartment(dept)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteDepartment(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Teams:</p>
                  <p className="text-sm text-gray-900">{dept.teamCount}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Members ({dept.memberCount}):</p>
                  <div className="flex flex-wrap gap-1">
                    {users
                      .filter((u) => dept.members.includes(u.id))
                      .slice(0, 5)
                      .map((user) => (
                        <span key={user.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {user.name}
                          <button 
                            onClick={() => handleRemoveUser(user.id, dept.id, 'department')}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    {dept.memberCount > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{dept.memberCount - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Assigned Surveys:</p>
                  <p className="text-sm text-gray-900">{dept.surveyCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>       
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Surveys
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {org.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.users}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.surveys}
                </td>                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "surveys": return renderSurveys();
      case "users": return renderUsers();
      case "teams": return renderTeams();
      case "roles": return renderRoles();
      case "departments": return renderDepartments();
      case "organizations": return renderOrganizations();
      default: return renderOverview();
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Global Admin": return Globe;
      case "Regional Admin": return MapPin;
      case "Local Admin": return Home;
      default: return UserCheck;
    }
  };

  const RoleIcon = getRoleIcon(currentUser?.role);
  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Organization Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <RoleIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{currentUser?.organization}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.department}
                      </p>
                    </div>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

  {/* Modals */}
      {showTeamModal && (
        <TeamModal
          editingTeam={editingTeam}
          teamForm={teamForm}
          departments={departments}
          onClose={() => {
            setShowTeamModal(false);
            setTeamForm({ name: '', department: '' });
            setEditingTeam(null);
          }}
          onChange={setTeamForm}
          onSubmit={handleTeamSubmit}
        />
      )}

      {showDepartmentModal && (
        <DepartmentModal
          editingDepartment={editingDepartment}
          departmentForm={departmentForm}
          onClose={() => {
            setShowDepartmentModal(false);
            setDepartmentForm({ name: '' });
            setEditingDepartment(null);
          }}
          onChange={setDepartmentForm}
          onSubmit={handleDepartmentSubmit}
        />
      )}

      {showUserAssignmentModal && (
        <UserAssignmentModal
          isOpen={showUserAssignmentModal}
          onClose={() => setShowUserAssignmentModal(false)}
          users={users}
          currentAssignments={
            assignmentType === 'team' 
              ? teams.find(t => t.id === assignmentTarget)?.members || []
              : departments.find(d => d.id === assignmentTarget)?.members || []
          }
          onAssign={handleUserAssignmentSubmit}
          title={`Assign Users to ${assignmentType}`}
          type={assignmentType}
          isEditing={!!assignmentTarget}
        />
      )}
    </div>
  );
};

export default Dashboard;
