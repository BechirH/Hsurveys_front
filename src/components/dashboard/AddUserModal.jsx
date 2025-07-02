import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { UserPlus, X } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
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

export default AddUserModal; 