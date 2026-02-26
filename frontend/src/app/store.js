import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import settingsReducer from "../store/settingsSlice";
import userReducer from "../store/userSlice";
import weatherReducer from "../store/weatherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    user: userReducer,
    settings: settingsReducer,
  },
});
