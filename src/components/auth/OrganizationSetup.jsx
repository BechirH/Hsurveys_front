import React, { useState, useEffect } from 'react';
import { ChevronLeft, Building2 } from 'lucide-react';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { createOrganization } from '../../redux/slices/organizationSlice';
import { useNavigate } from 'react-router-dom';

const OrganizationSetup = ({ 
  loading = false, 
  onBack = () => {}, 
  onSubmit = () => {}, 
  onSwitchToJoinOrganization = () => {},
  onOrgCreated = () => {},
  error
}) => {
  const [values, setValues] = useState({
    name: '',
  });

  const [touched, setTouched] = useState({
    name: false,
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: orgLoading, error: orgError, currentOrg } = useSelector(state => state.organization || {});

  useEffect(() => {
    console.log('currentOrg:', currentOrg);
    if (currentOrg && currentOrg.id) {
      onOrgCreated(currentOrg.id);
    }
  }, [currentOrg, onOrgCreated]);

  const validate = (fieldValues = values) => {
    let tempErrors = { ...errors };

    if ('name' in fieldValues) {
      tempErrors.name = fieldValues.name ? '' : 'Organization Name is required';
    }
    
    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === '');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    validate({ [name]: value });
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      dispatch(createOrganization({ name: values.name }));
    } else {
      setTouched({
        name: true, 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="card-base max-w-xl border border-gray-100">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 mr-8 p-1 mt-[-100px] rounded-full hover:bg-black- transition-colors"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-[140px] mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 pr-10">Setup Your Organization</h2>
            <p className="text-gray-600 mx-[70px]">Step 1: Organization Creation</p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-center animate-fade-in">
              <span className="font-semibold">{typeof error === 'object' && error.message ? error.message : String(error)}</span>
            </div>
          )}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="name"
            >
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all ${
                touched.name && errors.name
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="Enter organization name"
              required
            />
            {touched.name && errors.name && (
              <p className="error-box text-sm">{errors.name}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={orgLoading}
            fullWidth
            className="font-semibold transform transition-all duration-200 shadow-lg"
            variant={orgLoading ? undefined : 'primary'}
          >
            {orgLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Creating Organization...
              </span>
            ) : (
              'Continue To Account Creation'
            )}
          </Button>

          {orgError && (
            <div className="error-box text-sm">
              {typeof orgError === 'string'
                ? orgError
                : orgError && orgError.message
                  ? orgError.message
                  : JSON.stringify(orgError)}
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-gray-600">
               Join An Existing Organization?{' '}
              <Button
                onClick={onSwitchToJoinOrganization}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                type="button"
                variant="link"
              >
                Signup here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;