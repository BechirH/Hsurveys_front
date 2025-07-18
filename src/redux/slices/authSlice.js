import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

// Auto-login thunk - check if user is authenticated via backend
export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        return { user: response };
      } else {
        return rejectWithValue("Session expired");
      }
    } catch (error) {
      return rejectWithValue("Session verification failed");
    }
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

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return "Logged out successfully";
    } catch (err) {
      return "Logged out successfully";
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    errorLogin: null,
    errorRegisterNewOrg: null,
    errorRegisterExistingOrg: null,
    isInitialized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
      state.isInitialized = false;
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
      })
      .addCase(autoLogin.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = null;
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
            roles: action.payload.roles,
          };
          state.user = userData;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorLogin = action.payload || action.error.message;
      })
      .addCase(registerUserForNewOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterNewOrg = null;
      })
      .addCase(registerUserForNewOrg.fulfilled, (state, action) => {
        state.loading = false;
        // Set user in state from registration response
        if (action.payload && action.payload.username) {
          state.user = {
            username: action.payload.username,
            role: action.payload.roles && action.payload.roles.includes("ADMIN") ? "admin" : "user",
            organizationId: action.payload.organizationId,
            roles: action.payload.roles,
          };
        }
      })
      .addCase(registerUserForNewOrg.rejected, (state, action) => {
        state.loading = false;
        state.errorRegisterNewOrg = action.payload || action.error.message;
      })
      .addCase(registerUserForExistingOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterExistingOrg = null;
      })
      .addCase(registerUserForExistingOrg.fulfilled, (state, action) => {
        state.loading = false;
        // Set user in state from registration response
        if (action.payload && action.payload.username) {
          state.user = {
            username: action.payload.username,
            role: action.payload.roles && action.payload.roles.includes("ADMIN") ? "admin" : "user",
            organizationId: action.payload.organizationId,
            roles: action.payload.roles,
          };
        }
      })
      .addCase(registerUserForExistingOrg.rejected, (state, action) => {
        state.loading = false;
        state.errorRegisterExistingOrg = action.payload || action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.errorLogin = null;
        state.errorRegisterNewOrg = null;
        state.errorRegisterExistingOrg = null;
      });
  },
});

export const { logout, resetAuth, clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
