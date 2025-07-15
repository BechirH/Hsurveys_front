import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import organizationReducer from "./slices/organizationSlice";

// --- Persistence ---
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return undefined;
    }
    return { auth: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.auth);
    localStorage.setItem("authState", serializedState);
  } catch {

  }
};


export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

store.subscribe(() => {
  saveState(store.getState());
});
