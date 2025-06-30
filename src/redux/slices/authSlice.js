import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { organizationService } from "../../services/organizationService";
import { apiService } from "../../services/apiService";
import { sessionManager } from "../../utils/sessionManager";

// Utility to check token expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Auto-login thunk - simplified since state is preloaded
export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, { getState, rejectWithValue }) => {
    console.log("AutoLogin: Starting session restoration...");

    // Check Redux state (which is preloaded from localStorage)
    const { token, user } = getState().auth;
    console.log("AutoLogin: Redux state check:", {
      hasToken: !!token,
      hasUser: !!user,
      isTokenExpired: token ? isTokenExpired(token) : "no token",
    });

    if (token && user && !isTokenExpired(token)) {
      console.log("AutoLogin: Session valid - restoring authentication");
      authService.setAuthToken(token);
      return { user, token };
    }

    // No valid session found
    console.log("AutoLogin: No valid session found");
    authService.setAuthToken(null);
    return rejectWithValue("No valid session found");
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          "An error occurred";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

// Register user for a new organization (Step 2)
export const registerUserForNewOrg = createAsyncThunk(
  "auth/registerUserForNewOrg",
  async ({ orgId, userData }, { rejectWithValue }) => {
    try {
      const response = await authService.registerUserForNewOrg(orgId, userData);
      return response;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          "An error occurred";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

// Register user for an existing organization
export const registerUserForExistingOrg = createAsyncThunk(
  "auth/registerUserForExistingOrg",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.registerUserForExistingOrg(userData);
      return response;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          "An error occurred";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    errorLogin: null,
    errorRegisterNewOrg: null,
    errorRegisterExistingOrg: null,
    isInitialized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
      authService.setAuthToken(null);
      organizationService.setAuthToken(null);
      apiService.setUserAuthToken(null);
      apiService.setOrgAuthToken(null);
      apiService.setSurveyAuthToken(null);
      sessionManager.clearSession();
      // State will be automatically saved to localStorage by StateLoader
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
      state.isInitialized = false;
      authService.setAuthToken(null);
      organizationService.setAuthToken(null);
      apiService.setUserAuthToken(null);
      apiService.setOrgAuthToken(null);
      apiService.setSurveyAuthToken(null);
      sessionManager.clearSession();
      // State will be automatically saved to localStorage by StateLoader
    },
    clearAuthErrors: (state) => {
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        if (action.payload.token) {
          state.token = action.payload.token;
          authService.setAuthToken(action.payload.token);
          organizationService.setAuthToken(action.payload.token);
          apiService.setUserAuthToken(action.payload.token);
          apiService.setOrgAuthToken(action.payload.token);
          apiService.setSurveyAuthToken(action.payload.token);
          sessionManager.setSession(action.payload.token, action.payload.user);
        }
      })
      .addCase(autoLogin.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = null;
        state.token = null;
        authService.setAuthToken(null);
        organizationService.setAuthToken(null);
        apiService.setUserAuthToken(null);
        apiService.setOrgAuthToken(null);
        apiService.setSurveyAuthToken(null);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        let userData;
        if (action.payload.user) {
          userData = action.payload.user;
          state.user = action.payload.user;
        } else {
          userData = {
            username: action.payload.username,
            role:
              action.payload.roles && action.payload.roles.includes("ADMIN")
                ? "admin"
                : "user",
            organizationId: action.payload.organizationId,
          };
          state.user = userData;
        }
        state.token = action.payload.token;
        authService.setAuthToken(action.payload.token);
        organizationService.setAuthToken(action.payload.token);
        apiService.setUserAuthToken(action.payload.token);
        apiService.setOrgAuthToken(action.payload.token);
        apiService.setSurveyAuthToken(action.payload.token);
        sessionManager.setSession(
          action.payload.token,
          action.payload.user || userData
        );
        // State will be automatically saved to localStorage by StateLoader
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorLogin = action.payload || action.error.message;
        authService.setAuthToken(null);
        organizationService.setAuthToken(null);
        apiService.setUserAuthToken(null);
        apiService.setOrgAuthToken(null);
        apiService.setSurveyAuthToken(null);
      })
      .addCase(registerUserForNewOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterNewOrg = null;
      })
      .addCase(registerUserForNewOrg.fulfilled, (state, action) => {
        state.loading = false;
        let userData;
        if (action.payload.user) {
          userData = action.payload.user;
          state.user = action.payload.user;
        } else {
          userData = {
            username: action.payload.username,
            role:
              action.payload.roles && action.payload.roles.includes("ADMIN")
                ? "admin"
                : "user",
            organizationId: action.payload.organizationId,
          };
          state.user = userData;
        }
        state.token = action.payload.token;
        authService.setAuthToken(action.payload.token);
        organizationService.setAuthToken(action.payload.token);
        apiService.setUserAuthToken(action.payload.token);
        apiService.setOrgAuthToken(action.payload.token);
        apiService.setSurveyAuthToken(action.payload.token);
        sessionManager.setSession(
          action.payload.token,
          action.payload.user || userData
        );
        // State will be automatically saved to localStorage by StateLoader
      })
      .addCase(registerUserForNewOrg.rejected, (state, action) => {
        state.loading = false;
        state.errorRegisterNewOrg = action.payload || action.error.message;
        authService.setAuthToken(null);
        organizationService.setAuthToken(null);
        apiService.setUserAuthToken(null);
        apiService.setOrgAuthToken(null);
        apiService.setSurveyAuthToken(null);
      })
      .addCase(registerUserForExistingOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterExistingOrg = null;
      })
      .addCase(registerUserForExistingOrg.fulfilled, (state, action) => {
        state.loading = false;
        let userData;
        if (action.payload.user) {
          userData = action.payload.user;
          state.user = action.payload.user;
        } else {
          userData = {
            username: action.payload.username,
            role:
              action.payload.roles && action.payload.roles.includes("ADMIN")
                ? "admin"
                : "user",
            organizationId: action.payload.organizationId,
          };
          state.user = userData;
        }
        state.token = action.payload.token;
        authService.setAuthToken(action.payload.token);
        organizationService.setAuthToken(action.payload.token);
        apiService.setUserAuthToken(action.payload.token);
        apiService.setOrgAuthToken(action.payload.token);
        apiService.setSurveyAuthToken(action.payload.token);
        sessionManager.setSession(
          action.payload.token,
          action.payload.user || userData
        );
        // State will be automatically saved to localStorage by StateLoader
      })
      .addCase(registerUserForExistingOrg.rejected, (state, action) => {
        state.loading = false;
        state.errorRegisterExistingOrg = action.payload || action.error.message;
        authService.setAuthToken(null);
        organizationService.setAuthToken(null);
        apiService.setUserAuthToken(null);
        apiService.setOrgAuthToken(null);
        apiService.setSurveyAuthToken(null);
      });
  },
});

export const { logout, resetAuth, clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
