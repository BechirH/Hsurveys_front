import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Fixed: renamed from userReducer
import organizationReducer from "./slices/organizationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Fixed: changed from 'user' to 'auth'
    organization: organizationReducer,
  },
});
