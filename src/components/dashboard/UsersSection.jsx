import React, { useState } from "react";
import { UserPlus, Eye, Edit, X } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { useSelector } from 'react-redux';
import { apiService } from '../../services/apiService';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="username"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex space-x-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              label="Cancel"
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              label="Add User"
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersSection = ({ users, onAddUser, reload }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <AddUserModal open={showModal} onClose={() => setShowModal(false)} onSuccess={reload} />
      <div className="flex-between">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header-base">User</th>
                <th className="table-header-base">Email</th>
                <th className="table-header-base">Role</th>
                <th className="table-header-base">Department</th>
                <th className="table-header-base">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="table-cell-base">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </td>
                  <td className="table-cell-base text-sm text-gray-500">{user.email}</td>
                  <td className="table-cell-base">
                    <span className="tag-base bg-purple-100 text-purple-800">
                      {user.roles?.join(', ') || 'User'}
                    </span>
                  </td>
                  <td className="table-cell-base text-sm text-gray-500">
                    {user.department || 'Not assigned'}
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
};

export default UsersSection; 