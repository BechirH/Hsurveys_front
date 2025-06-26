import React, { useState } from 'react';
import { User, Eye, EyeOff, Mail, Lock, Key } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';

const SignupUser = ({ 
  loading = false, 
  error = null, 
  onChange, 
  onSubmit, 
  onSwitchToLogin 
}) => {
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (onChange) onChange(e);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  const validate = () => {
    const validationErrors = {};
    if (!formValues.username.trim()) validationErrors.username = 'Username is required';
    if (!formValues.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      validationErrors.email = 'Email address is invalid';
    }
    if (!formValues.password) validationErrors.password = 'Password is required';
    if (!formValues.confirmPassword) validationErrors.confirmPassword = 'Please confirm your password';
    if (formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword) {
      validationErrors.confirmPassword = "Passwords don't match";
    }
    if (!formValues.inviteCode) validationErrors.inviteCode = 'Invitation code is required';
    setFormErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSubmit) onSubmit({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          inviteCode: formValues.inviteCode,
        });
      }, 1000);
    } else {
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        inviteCode: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="card-base max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
          <p className="text-gray-600">Enter your details</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-center animate-fade-in">
            <span className="font-semibold">{typeof error === 'object' && error.message ? error.message : String(error)}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <InputField
              id="username"
              label="Username"
              icon={User}
              name="username"
              type="text"
              value={formValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && formErrors.username ? formErrors.username : ''}
              placeholder="Enter your username"
            />
            <InputField
              id="email"
              label="Email Address"
              icon={Mail}
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && formErrors.email ? formErrors.email : ''}
              placeholder="Enter your email"
            />
            <InputField
              id="inviteCode"
              label="Invitation Code"
              icon={Key}
              name="inviteCode"
              type="text"
              value={formValues.inviteCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.inviteCode && formErrors.inviteCode ? formErrors.inviteCode : ''}
              placeholder="Enter invitation code"
            />
            <div className="relative">
              <InputField
                id="password"
                label="Password"
                icon={Lock}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && formErrors.password ? formErrors.password : ''}
                placeholder="Create a password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                icon={Lock}
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formValues.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && formErrors.confirmPassword ? formErrors.confirmPassword : ''}
                placeholder="Confirm your password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            fullWidth
            className="bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            variant="primary"
          >
            {isSubmitting || loading ? 'Joining Organization...' : 'Join Organization'}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors"
              type="button"
              variant="link"
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupUser;