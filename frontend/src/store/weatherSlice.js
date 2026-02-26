import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentByCity: {},
  forecastByCity: {},
  status: "idle",
  error: null,
  selectedCity: "",
  defaultCity: "",
};

// Slice owns state transitions only; side-effects are delegated to controllers.
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setWeatherCurrent: (state, action) => {
      const weather = action.payload;
      state.currentByCity[weather.city.toLowerCase()] = weather;
      state.selectedCity = weather.city;
      state.status = "succeeded";
      state.error = null;
    },
    setDefaultCity: (state, action) => {
      state.defaultCity = action.payload || "";
    },
    removeWeatherCity: (state, action) => {
      const city = action.payload?.toLowerCase?.();
      if (!city) return;
      delete state.currentByCity[city];
      if (state.selectedCity.toLowerCase() === city) {
        state.selectedCity = Object.values(state.currentByCity)[0]?.city || "";
      }
    },
    setWeatherForecast: (state, action) => {
      const { city, forecast } = action.payload;
      state.forecastByCity[city.toLowerCase()] = {
        city,
        ...forecast,
        fetchedAt: Date.now(),
      };
      state.status = "succeeded";
      state.error = null;
    },
    setWeatherError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearWeatherError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setWeatherLoading,
  setWeatherCurrent,
  setDefaultCity,
  removeWeatherCity,
  setWeatherForecast,
  setWeatherError,
  clearWeatherError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
