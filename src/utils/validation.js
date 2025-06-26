export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateForm = (formData, step) => {
  const errors = {};
  
  if (step === 'login' || step === 'signup') {
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (!validatePassword(formData.password)) errors.password = 'Password must be at least 8 characters';
  }
  
  if (step === 'signup') {
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  if (step === 'organization') {
    if (!formData.orgName?.trim()) errors.orgName = 'Organization name is required';
    if (!formData.industry) errors.industry = 'Industry is required';
    if (!formData.country?.trim()) errors.country = 'Country is required';
    if (!formData.city?.trim()) errors.city = 'City is required';
    if (!formData.size) errors.size = 'Organization size is required';
  }
  
  return errors;
};