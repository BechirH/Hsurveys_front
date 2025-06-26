import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authSlice";
import organizationReducer from "./slices/organizationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
  },
});
