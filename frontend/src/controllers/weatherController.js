import { normalizeForecast } from "../models/forecastModel";
import { normalizeWeather } from "../models/weatherModel";
import apiClient from "../services/apiClient";
import {
  setWeatherCurrent,
  setWeatherError,
  setWeatherForecast,
  setWeatherLoading,
} from "../store/weatherSlice";

// Cache policy lives in controller layer so views stay pure and stateless.
const CACHE_WINDOW_MS = 60 * 1000;

export const fetchWeatherByCity = (city) => async (dispatch, getState) => {
  const normalizedCity = city.trim().toLowerCase();
  if (!normalizedCity) {
    return;
  }

  const cached = getState().weather.currentByCity[normalizedCity];
  if (cached && Date.now() - cached.fetchedAt < CACHE_WINDOW_MS) {
    return;
  }

  dispatch(setWeatherLoading());
  try {
    const response = await apiClient.get("/weather", {
      params: { city: city.trim() },
    });
    dispatch(setWeatherCurrent(normalizeWeather(response.data)));
  } catch (error) {
    dispatch(setWeatherError(error.message));
  }
};

export const fetchForecastByCity = (city) => async (dispatch, getState) => {
  const normalizedCity = city.trim().toLowerCase();
  if (!normalizedCity) {
    return;
  }

  const cached = getState().weather.forecastByCity[normalizedCity];
  if (cached && Date.now() - cached.fetchedAt < CACHE_WINDOW_MS) {
    return;
  }

  dispatch(setWeatherLoading());
  try {
    const response = await apiClient.get("/weather/forecast", {
      params: { city: city.trim() },
    });
    dispatch(
      setWeatherForecast({
        city: city.trim(),
        forecast: normalizeForecast(response.data),
      }),
    );
  } catch (error) {
    dispatch(setWeatherError(error.message));
  }
};
