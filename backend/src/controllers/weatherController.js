import { getCachedValue, setCachedValue } from "../services/cacheService.js";
import {
  fetchForecastWeather,
  fetchCurrentWeather,
  fetchCurrentWeatherByCoordinates,
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

const validateCoordinate = (value, min, max) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
};

export const getWeatherByCity = async (req, res, next) => {
  try {
    const city = validateCity(req.query.city);
    if (city) {
      const cacheKey = `current:${city.toLowerCase()}`;
      const cached = getCachedValue(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }

      const weather = await fetchCurrentWeather(city);
      setCachedValue(cacheKey, weather);
      return res.status(200).json(weather);
    }

    const lat = validateCoordinate(req.query.lat, -90, 90);
    const lon = validateCoordinate(req.query.lon, -180, 180);
    if (lat === null || lon === null) {
      return res.status(400).json({
        message: "Valid city query or lat/lon coordinates are required",
      });
    }

    const cacheKey = `current:coords:${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const weather = await fetchCurrentWeatherByCoordinates({ lat, lon });
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
