const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Model normalizes backend shape into a UI-safe contract.
export const normalizeWeather = (data) => ({
  city: data?.city ?? data?.name ?? "Unknown",
  temperature: toNumber(data?.temperature ?? data?.temp),
  humidity: toNumber(data?.humidity),
  windSpeed: toNumber(data?.windSpeed ?? data?.wind_speed),
  condition: data?.condition ?? data?.weather ?? "N/A",
  icon: data?.icon ?? null,
  fetchedAt: Date.now(),
});
