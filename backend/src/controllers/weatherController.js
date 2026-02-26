import { getCachedValue, setCachedValue } from "../services/cacheService.js";
import {
  fetchForecastWeather,
  fetchCurrentWeather,
} from "../services/weatherApiService.js";

const validateCity = (city) => {
  if (!city || typeof city !== "string") {
    return null;
  }

  const normalized = city.trim();
  if (!normalized || normalized.length > 100) {
    return null;
  }

  return normalized;
};

export const getWeatherByCity = async (req, res, next) => {
  try {
    const city = validateCity(req.query.city);
    if (!city) {
      return res.status(400).json({ message: "Valid city query is required" });
    }

    const cacheKey = `current:${city.toLowerCase()}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const weather = await fetchCurrentWeather(city);
    setCachedValue(cacheKey, weather);
    return res.status(200).json(weather);
  } catch (error) {
    return next(error);
  }
};

export const getForecastByCity = async (req, res, next) => {
  try {
    const city = validateCity(req.query.city);
    if (!city) {
      return res.status(400).json({ message: "Valid city query is required" });
    }

    const cacheKey = `forecast:${city.toLowerCase()}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const forecast = await fetchForecastWeather(city);
    setCachedValue(cacheKey, forecast);
    return res.status(200).json(forecast);
  } catch (error) {
    return next(error);
  }
};
