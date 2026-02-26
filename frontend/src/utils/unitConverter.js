export const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

export const formatTemperature = (value, unit) => {
  if (typeof value !== "number") {
    return "--";
  }

  if (unit === "fahrenheit") {
    return `${Math.round(celsiusToFahrenheit(value))}degF`;
  }

  return `${Math.round(value)}degC`;
};
