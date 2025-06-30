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

import AuthSystem from "./components/auth/AuthSystem";
import Dashboard from "./pages/Dashboard";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// App Routes Component (needs to be inside Provider)
const AppRoutes = () => {
  const dispatch = useDispatch();
  const { user, token, isInitialized } = useSelector((state) => state.auth);

  // Auto-login on app start
  useEffect(() => {
    if (!isInitialized) {
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
