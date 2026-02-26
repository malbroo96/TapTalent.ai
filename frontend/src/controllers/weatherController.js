import { normalizeForecast } from "../models/forecastModel";
import { normalizeWeather } from "../models/weatherModel";
import apiClient from "../services/apiClient";
import {
  setWeatherCurrent,
  setDefaultCity,
  setWeatherError,
  setWeatherForecast,
  setWeatherLoading,
} from "../store/weatherSlice";

// Cache policy lives in controller layer so views stay pure and stateless.
const CACHE_WINDOW_MS = 60 * 1000;
const inFlightWeatherRequests = new Set();
const inFlightForecastRequests = new Set();
let isCoordinatesRequestInFlight = false;

export const fetchWeatherByCity = (city) => async (dispatch, getState) => {
  const normalizedCity = city.trim().toLowerCase();
  if (!normalizedCity) {
    return;
  }

  const cached = getState().weather.currentByCity[normalizedCity];
  if (cached && Date.now() - cached.fetchedAt < CACHE_WINDOW_MS) {
    return;
  }
  if (inFlightWeatherRequests.has(normalizedCity)) {
    return;
  }

  inFlightWeatherRequests.add(normalizedCity);
  dispatch(setWeatherLoading());
  try {
    const response = await apiClient.get("/weather", {
      params: { city: city.trim() },
    });
    dispatch(setWeatherCurrent(normalizeWeather(response.data)));
  } catch (error) {
    dispatch(setWeatherError(error.message));
  } finally {
    inFlightWeatherRequests.delete(normalizedCity);
  }
};

export const fetchWeatherByCoordinates =
  ({ lat, lon }) =>
  async (dispatch) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }
    if (isCoordinatesRequestInFlight) {
      return;
    }

    isCoordinatesRequestInFlight = true;
    dispatch(setWeatherLoading());
    try {
      const response = await apiClient.get("/weather", {
        params: { lat, lon },
      });
      const normalized = normalizeWeather(response.data);
      dispatch(setWeatherCurrent(normalized));
      dispatch(setDefaultCity(normalized.city));
    } catch (error) {
      dispatch(setWeatherError(error.message));
    } finally {
      isCoordinatesRequestInFlight = false;
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
  if (inFlightForecastRequests.has(normalizedCity)) {
    return;
  }

  inFlightForecastRequests.add(normalizedCity);
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
  } finally {
    inFlightForecastRequests.delete(normalizedCity);
  }
};
