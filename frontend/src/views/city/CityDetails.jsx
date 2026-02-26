import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastByCity } from "../../controllers/weatherController";
import { formatTemperature } from "../../utils/unitConverter";
import WeatherTrendChart from "../charts/WeatherTrendChart";
import WeatherCardSkeleton from "../layout/WeatherCardSkeleton";

const CityDetails = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const city = decodeURIComponent(name ?? "");

  const forecastState = useSelector(
    (state) => state.weather.forecastByCity[city.toLowerCase()],
  );
  const status = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);
  const unit = useSelector((state) => state.settings.unit);

  useEffect(() => {
    if (city) {
      dispatch(fetchForecastByCity(city));
    }
  }, [city, dispatch]);

  const tempChartData = useMemo(
    () =>
      (forecastState?.hourly ?? []).map((point) => ({
        ...point,
        temp: unit === "fahrenheit" ? (point.temp * 9) / 5 + 32 : point.temp,
      })),
    [forecastState?.hourly, unit],
  );

  if (status === "loading" && !forecastState) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{city} Forecast</h1>
        <Link
          className="rounded-xl bg-white/15 px-4 py-2 text-sm transition-all duration-300 hover:scale-105"
          to="/"
        >
          Back to Dashboard
        </Link>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/20 p-4 text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold">5-Day Forecast</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(forecastState?.daily ?? []).map((day) => (
            <article
              key={`${day.date}-${day.label}`}
              className="rounded-xl bg-slate-950/35 p-3 transition-all duration-300 hover:scale-105"
            >
              <p className="text-sm text-slate-300">{day.date}</p>
              <p className="mt-2 text-lg font-semibold">
                {formatTemperature(day.temp, unit)}
              </p>
              <p className="text-sm text-slate-200">{day.condition}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold">Hourly Forecast</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/20 text-left text-slate-300">
                <th className="py-2">Time</th>
                <th className="py-2">Temp</th>
                <th className="py-2">Precipitation</th>
              </tr>
            </thead>
            <tbody>
              {(forecastState?.hourly ?? []).slice(0, 12).map((hour) => (
                <tr key={hour.label} className="border-b border-white/10">
                  <td className="py-2">{hour.label}</td>
                  <td className="py-2">{formatTemperature(hour.temp, unit)}</td>
                  <td className="py-2">{hour.precipitation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">Temperature Trend</h3>
          <WeatherTrendChart data={tempChartData} dataKey="temp" stroke="#67e8f9" fill="#0891b2" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold">Precipitation</h3>
          <WeatherTrendChart
            data={forecastState?.hourly ?? []}
            dataKey="precipitation"
            stroke="#c084fc"
            fill="#9333ea"
          />
        </div>
      </div>
    </section>
  );
};

export default CityDetails;
