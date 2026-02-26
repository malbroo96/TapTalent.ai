import { useMemo } from "react";
import { useSelector } from "react-redux";
import { formatTemperature } from "../utils/unitConverter";

export const useWeather = (city) => {
  const unit = useSelector((state) => state.settings.unit);
  const weather = useSelector((state) => state.weather.currentByCity[city?.toLowerCase()]);

  return useMemo(() => {
    if (!weather) {
      return null;
    }

    return {
      ...weather,
      formattedTemperature: formatTemperature(weather.temperature, unit),
    };
  }, [weather, unit]);
};
