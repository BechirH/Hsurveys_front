import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      console.log("=== LOGIN ERROR DEBUG ===");
      console.log("Full error:", err);
      console.log("Error response:", err.response);
      console.log("Error response data:", err.response?.data);
      console.log("Error message from backend:", err.response?.data?.message);
      console.log("========================");

      if (err.response && err.response.data) {
        // Extract the message from your backend error structure
        const errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          "An error occurred";
        console.log("Extracted error message:", errorMessage);
        return rejectWithValue(errorMessage);
      }
      const fallbackError = err.message || "Unknown error";
      console.log("Using fallback error:", fallbackError);
      return rejectWithValue(fallbackError);
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
      console.log("=== REGISTER NEW ORG ERROR DEBUG ===");
      console.log("Full error:", err);
      console.log("Error response data:", err.response?.data);
      console.log("===================================");

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
      console.log("=== REGISTER EXISTING ORG ERROR DEBUG ===");
      console.log("Full error:", err);
      console.log("Error response data:", err.response?.data);
      console.log("========================================");

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
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearAuthErrors: (state) => {
      state.errorLogin = null;
      state.errorRegisterNewOrg = null;
      state.errorRegisterExistingOrg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        console.log("Login pending - clearing error");
        state.loading = true;
        state.errorLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login fulfilled");
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        } else {
          // Fallback for backend response without user object
          state.user = {
            username: action.payload.username,
            role:
              action.payload.roles && action.payload.roles.includes("ADMIN")
                ? "admin"
                : "user",
            organizationId: action.payload.organizationId,
          };
        }
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("=== LOGIN REJECTED IN REDUCER ===");
        console.log("Action payload:", action.payload);
        console.log("Action error:", action.error);
        console.log(
          "Setting errorLogin to:",
          action.payload || action.error.message
        );
        console.log("================================");

        state.loading = false;
        state.errorLogin = action.payload || action.error.message;

        console.log("State after setting error:", state.errorLogin);
      })
      // Register for new org
      .addCase(registerUserForNewOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterNewOrg = null;
      })
      .addCase(registerUserForNewOrg.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        } else {
          // Fallback for backend response without user object
          state.user = {
            username: action.payload.username,
            role:
              action.payload.roles && action.payload.roles.includes("ADMIN")
                ? "admin"
                : "user",
            organizationId: action.payload.organizationId,
          };
        }
        state.token = action.payload.token;
      })
      .addCase(registerUserForNewOrg.rejected, (state, action) => {
        console.log("Register new org rejected - payload:", action.payload);
        state.loading = false;
        state.errorRegisterNewOrg = action.payload || action.error.message;
      })
      // Register for existing org
      .addCase(registerUserForExistingOrg.pending, (state) => {
        state.loading = true;
        state.errorRegisterExistingOrg = null;
      })
      .addCase(registerUserForExistingOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUserForExistingOrg.rejected, (state, action) => {
        console.log(
          "Register existing org rejected - payload:",
          action.payload
        );
        state.loading = false;
        state.errorRegisterExistingOrg = action.payload || action.error.message;
      });
  },
});

export const { logout, clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
