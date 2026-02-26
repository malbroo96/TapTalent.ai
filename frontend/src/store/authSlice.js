import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
      state.initialized = true;
    },
    setAuthError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
      state.initialized = true;
    },
    setAuthInitialized: (state) => {
      state.initialized = true;
      if (state.status === "idle") {
        state.status = "succeeded";
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.initialized = true;
    },
  },
});

export const {
  setAuthLoading,
  setAuthUser,
  setAuthError,
  setAuthInitialized,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
