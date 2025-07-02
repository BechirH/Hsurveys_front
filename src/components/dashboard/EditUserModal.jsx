import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import { apiService } from '../../services/apiService';

const EditUserModal = ({ open, user, onClose, onSuccess }) => {
  const [form, setForm] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
      });
      setError('');
    }
  }, [open, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiService.updateUser(user.id, form);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Edit User</h3>
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
          {error && <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded text-sm animate-fade-in">{error}</div>}
          <div className="flex space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose} label="Cancel" className="flex-1" />
            <Button type="submit" variant="primary" loading={loading} label="Save Changes" className="flex-1" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal; 