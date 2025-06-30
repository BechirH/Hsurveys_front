import React from 'react';
import { 
  ClipboardList, 
  Users, 
  Building, 
  BarChart3, 
  Plus, 
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import NavBar from '../components/common/NavBar';

const UserHome = () => {
  // Mock data for survey app context
  const surveyStats = [
    { title: 'Active Surveys', value: '5', icon: ClipboardList, color: 'bg-blue-500', description: 'Surveys you can participate in' },
    { title: 'Completed', value: '12', icon: Award, color: 'bg-green-500', description: 'Surveys you\'ve finished' },
    { title: 'Department', value: 'Computer Science', icon: Building, color: 'bg-purple-500', description: 'Your department' },
    { title: 'Team Members', value: '8', icon: Users, color: 'bg-orange-500', description: 'In your team' },
  ];

  const recentSurveys = [
    { 
      title: 'Student Satisfaction Survey', 
      department: 'Computer Science',
      team: 'Software Engineering',
      status: 'Active',
      dueDate: '2024-01-15',
      progress: 75,
      type: 'Course Feedback'
    },
    { 
      title: 'Faculty Evaluation', 
      department: 'Computer Science',
      team: 'Data Science',
      status: 'Completed',
      dueDate: '2024-01-10',
      progress: 100,
      type: 'Faculty Assessment'
    },
    { 
      title: 'Campus Facilities Survey', 
      department: 'Computer Science',
      team: 'All Teams',
      status: 'Active',
      dueDate: '2024-01-20',
      progress: 30,
      type: 'Infrastructure'
    },
  ];

  const upcomingSurveys = [
    { title: 'Research Methodology Feedback', date: '2024-01-25', type: 'Academic' },
    { title: 'Library Services Assessment', date: '2024-01-30', type: 'Services' },
    { title: 'Student Life Quality', date: '2024-02-05', type: 'Lifestyle' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <ClipboardList className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Survey Dashboard</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Welcome to the University Survey Portal. Participate in surveys to help improve our academic community.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {surveyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Surveys */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Surveys</h2>
                <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  <span>View All</span>
                </button>
              </div>
              <div className="space-y-4">
                {recentSurveys.map((survey, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{survey.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{survey.department}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{survey.team}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{survey.type}</span>
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{survey.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(survey.progress)}`}
                            style={{ width: `${survey.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="text-sm font-medium text-gray-800">{survey.dueDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Take Survey</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">View Results</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Team Dashboard</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Survey Calendar</span>
                </button>
              </div>
            </div>

            {/* Upcoming Surveys */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Surveys</h2>
              <div className="space-y-3">
                {upcomingSurveys.map((survey, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{survey.title}</p>
                      <p className="text-xs text-gray-500">{survey.type} • {survey.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Info</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Computer Science</p>
                    <p className="text-sm text-gray-500">Faculty of Engineering</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Software Engineering</p>
                    <p className="text-sm text-gray-500">Your Team</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Survey Participation</p>
                    <p className="text-sm text-gray-500">85% Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Insights */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Survey Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-600">Average Response Rate</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Surveys Completed This Semester</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">4.2/5</p>
              <p className="text-sm text-gray-600">Average Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome; 