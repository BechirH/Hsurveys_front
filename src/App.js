import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { store } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin } from "./redux/slices/authSlice";
import { sessionManager } from "./utils/sessionManager";
import { apiService } from "./services/apiService";
import { organizationService } from "./services/organizationService";
import { authService } from "./services/authService";

import AuthSystem from "./components/auth/AuthSystem";
import Dashboard from "./pages/Dashboard";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Token Manager Component
const TokenManager = () => {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("🔑 TokenManager: Token changed", {
      token: token ? "present" : "null",
    });

    if (token) {
      console.log("🔑 Setting tokens on all API clients...");

      // Set tokens immediately
      apiService.setUserAuthToken(token);
      apiService.setOrgAuthToken(token);
      apiService.setSurveyAuthToken(token);
      organizationService.setAuthToken(token);
      authService.setAuthToken(token);

      console.log("🔑 Tokens set successfully");
    } else {
      console.log("🔑 Clearing tokens from all API clients...");

      // Clear tokens
      apiService.setUserAuthToken(null);
      apiService.setOrgAuthToken(null);
      apiService.setSurveyAuthToken(null);
      organizationService.setAuthToken(null);
      authService.setAuthToken(null);

      console.log("🔑 Tokens cleared successfully");
    }
  }, [token]);

  return null; // This component doesn't render anything
};

// App Routes Component (needs to be inside Provider)
const AppRoutes = () => {
  const dispatch = useDispatch();
  const { user, token, isInitialized } = useSelector((state) => state.auth);

  // Auto-login on app start
  useEffect(() => {
    console.log("🚀 AppRoutes: Checking initialization", { isInitialized });
    if (!isInitialized) {
      console.log("🚀 Starting auto-login...");
      dispatch(autoLogin());
    }
  }, [dispatch, isInitialized]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Initializing..." />
      </div>
    );
  }

  // Determine the appropriate redirect path based on user role
  const getRedirectPath = () => {
    if (user && token) {
      return user.role === "admin" ? "/dashboard" : "/user-home";
    }
    return "/";
  };

  return (
    <>
      <TokenManager />
      <Routes>
        <Route
          path="/"
          element={
            user && token ? (
              <Navigate to={getRedirectPath()} replace />
            ) : (
              <AuthSystem />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
