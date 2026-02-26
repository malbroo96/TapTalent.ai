import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unit: "celsius",
  darkMode: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
    },
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleUnit, setUnit, toggleDarkMode } = settingsSlice.actions;

export default settingsSlice.reducer;
