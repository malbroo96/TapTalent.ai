import apiClient from "../services/apiClient";
import { normalizeUser } from "../models/userModel";
import {
  clearAuth,
  setAuthError,
  setAuthInitialized,
  setAuthLoading,
  setAuthUser,
} from "../store/authSlice";

// Auth orchestration is isolated here so components only dispatch intents.
export const loadCurrentUser = () => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    const response = await apiClient.get("/auth/me");
    dispatch(setAuthUser(normalizeUser(response.data?.user ?? response.data)));
  } catch {
    dispatch(clearAuth());
    dispatch(setAuthInitialized());
  }
};

export const loginWithGoogle = () => async () => {
  const base = apiClient.defaults.baseURL.replace(/\/$/, "").replace(/\/api$/, "");
  window.location.assign(`${base}/api/auth/google`);
};

export const logout = () => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    await apiClient.post("/auth/logout");
    dispatch(clearAuth());
  } catch (error) {
    dispatch(setAuthError(error.message));
  }
};
