import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import organizationReducer from "./slices/organizationSlice";
import StateLoader from "../utils/stateLoader";

// Create state loader instance
const stateLoader = new StateLoader();

// Load initial state from localStorage
const preloadedState = stateLoader.loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Subscribe to store changes and save state to localStorage
store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

// Export the state loader for manual operations if needed
export { stateLoader };
