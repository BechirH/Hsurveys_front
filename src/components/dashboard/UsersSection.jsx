import React, { useState } from "react";
import { UserPlus, Edit, X, Trash2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { useSelector } from 'react-redux';
import { apiService } from '../../services/apiService';
import AssignRoleModal from './AssignRoleModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AddUserModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector(state => state.auth);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      apiService.setUserAuthToken(token);
      await apiService.addUser(form);
      setForm({ username: "", email: "", password: "" });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100 animate-slide-up border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="username"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              label="Cancel"
              className="flex-1 hover:bg-gray-100 transition-colors duration-200"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              label="Add User"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersSection = ({ users, onAddUser, reload, roles = [], departments = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination, search, and filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(1);
  const USERS_PER_PAGE = 10;

  // Filtered and searched users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? (user.roles?.includes(roleFilter)) : true;
    const matchesDepartment = departmentFilter ? (user.department === departmentFilter) : true;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Reset page if filters/search change
  React.useEffect(() => { setPage(1); }, [search, roleFilter, departmentFilter]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeletingUserId(selectedUser.id);
    try {
      await apiService.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      reload && reload();
    } catch (err) {
      alert('Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'bg-red-100 text-red-800 border-red-200',
      'Manager': 'bg-orange-100 text-orange-800 border-orange-200',
      'User': 'bg-blue-100 text-blue-800 border-blue-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || colors.default;
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <AddUserModal open={showModal && !selectedUser} onClose={() => setShowModal(false)} onSuccess={reload} />
      <AssignRoleModal open={showModal && !!selectedUser} user={selectedUser} onClose={handleCloseModal} onSuccess={reload} />
      <EditUserModal open={showEditModal} user={selectedUser} onClose={() => { setShowEditModal(false); setSelectedUser(null); }} onSuccess={reload} />
      <DeleteConfirmationModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteUser} loading={deletingUserId !== null} user={selectedUser} />
      
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
              <p className="text-sm text-gray-600">Manage your team members and their access</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 w-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer text-sm"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role.id || role} value={role.name || role}>
                    {role.name || role}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dep => (
                <option key={dep.id || dep} value={dep.name || dep}>
                  {dep.name || dep}
                </option>
              ))}
            </select>
            
            {/* Add User Button */}
            <button 
              onClick={() => { setShowModal(true); setSelectedUser(null); }} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md whitespace-nowrap text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                  onClick={() => handleRowClick(user)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                        <span className="text-white text-sm font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {(user.roles || ['User']).map(role => (
                        <span 
                          key={role} 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {user.department || 'Not assigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110" 
                        onClick={e => { e.stopPropagation(); handleEditUser(user); }}
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50" 
                        onClick={e => { e.stopPropagation(); setSelectedUser(user); setShowDeleteModal(true); }} 
                        disabled={deletingUserId === user.id}
                        title="Delete user"
                      >
                        {deletingUserId === user.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-red-400 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-gray-500 font-medium">No users found</div>
                      <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Pagination */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * USERS_PER_PAGE) + 1} to {Math.min(page * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 text-sm rounded-lg transition-all duration-200 ${
                        pageNum === page 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UsersSection;