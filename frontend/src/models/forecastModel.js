const normalizePoint = (point, index) => ({
  label: point?.label ?? point?.time ?? point?.hour ?? `T${index + 1}`,
  temp: Number(point?.temperature ?? point?.temp ?? 0),
  precipitation: Number(point?.precipitation ?? point?.rain ?? 0),
});

export const normalizeForecast = (data = {}) => {
  const dailyRaw = Array.isArray(data.daily) ? data.daily : [];
  const hourlyRaw = Array.isArray(data.hourly) ? data.hourly : [];

  return {
    daily: dailyRaw.slice(0, 5).map((point, index) => ({
      ...normalizePoint(point, index),
      date: point?.date ?? point?.day ?? `Day ${index + 1}`,
      condition: point?.condition ?? "N/A",
    })),
    hourly: hourlyRaw.slice(0, 24).map(normalizePoint),
  };
};
