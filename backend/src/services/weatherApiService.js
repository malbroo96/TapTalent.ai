import axios from "axios";

const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

const getApiKey = () => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("WEATHER_API_KEY is not configured");
  }
  return apiKey;
};

const normalizeCurrent = (payload) => ({
  city: payload.name,
  temperature: payload.main?.temp ?? 0,
  humidity: payload.main?.humidity ?? 0,
  windSpeed: payload.wind?.speed ?? 0,
  condition: payload.weather?.[0]?.main ?? "Unknown",
  icon: payload.weather?.[0]?.icon ?? null,
});

const normalizeForecast = (payload) => {
  const list = Array.isArray(payload.list) ? payload.list : [];

  const hourly = list.slice(0, 24).map((item) => ({
    label: item.dt_txt,
    temp: item.main?.temp ?? 0,
    precipitation: item.rain?.["3h"] ?? 0,
  }));

  const uniqueDays = new Map();
  for (const item of list) {
    const day = item.dt_txt?.split(" ")?.[0];
    if (day && !uniqueDays.has(day)) {
      uniqueDays.set(day, {
        date: day,
        label: day,
        temp: item.main?.temp ?? 0,
        condition: item.weather?.[0]?.main ?? "Unknown",
      });
    }

    if (uniqueDays.size >= 5) {
      break;
    }
  }

  return {
    city: payload.city?.name || "Unknown",
    daily: Array.from(uniqueDays.values()),
    hourly,
  };
};

export const fetchCurrentWeather = async (city) => {
  const apiKey = getApiKey();

  const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
    params: {
      q: city,
      appid: apiKey,
      units: "metric",
    },
    timeout: 10000,
  });

  return normalizeCurrent(response.data);
};

export const fetchForecastWeather = async (city) => {
  const apiKey = getApiKey();

  const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: apiKey,
      units: "metric",
    },
    timeout: 10000,
  });

  return normalizeForecast(response.data);
};
