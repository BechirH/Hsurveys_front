import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuth } from "../redux/slices/authSlice";
import { resetOrganization } from "../redux/slices/organizationSlice";
import { sessionManager } from "../utils/sessionManager";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, isInitialized } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = !!(user && token);
  const hasValidSession = sessionManager.isAuthenticated();

  const handleLogout = () => {
    dispatch(resetAuth());
    dispatch(resetOrganization());
    navigate("/", { replace: true });
  };

  const checkAuth = () => {
    return isAuthenticated || hasValidSession;
  };

  return {
    user,
    token,
    loading,
    isInitialized,
    isAuthenticated,
    hasValidSession,
    checkAuth,
    logout: handleLogout,
  };
};
