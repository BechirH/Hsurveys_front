class StateLoader {
  constructor() {
    this.stateKey = "auth_state";
  }

  loadState() {
    try {
      let serializedState = localStorage.getItem(this.stateKey);

      if (serializedState === null) {
        return this.initializeState();
      }

      const parsedState = JSON.parse(serializedState);

      // Validate the loaded state structure
      if (this.isValidState(parsedState)) {
        console.log("StateLoader: Loaded state from localStorage");
        return parsedState;
      } else {
        console.log(
          "StateLoader: Invalid state structure, using initial state"
        );
        return this.initializeState();
      }
    } catch (err) {
      console.error("StateLoader: Error loading state:", err);
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      // Only save the auth part of the state
      const authState = {
        auth: state.auth,
      };

      let serializedState = JSON.stringify(authState);
      localStorage.setItem(this.stateKey, serializedState);
      console.log("StateLoader: State saved to localStorage");
    } catch (err) {
      console.error("StateLoader: Error saving state:", err);
    }
  }

  initializeState() {
    return {
      auth: {
        user: null,
        token: null,
        loading: false,
        errorLogin: null,
        errorRegisterNewOrg: null,
        errorRegisterExistingOrg: null,
        isInitialized: false,
      },
    };
  }

  isValidState(state) {
    // Basic validation to ensure the state has the expected structure
    return (
      state &&
      state.auth &&
      typeof state.auth === "object" &&
      "user" in state.auth &&
      "token" in state.auth &&
      "isInitialized" in state.auth
    );
  }

  clearState() {
    try {
      localStorage.removeItem(this.stateKey);
      console.log("StateLoader: State cleared from localStorage");
    } catch (err) {
      console.error("StateLoader: Error clearing state:", err);
    }
  }
}

export default StateLoader;
