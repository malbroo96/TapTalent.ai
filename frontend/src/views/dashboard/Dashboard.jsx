import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherByCity } from "../../controllers/weatherController";
import { addFavoriteCity, fetchFavorites } from "../../controllers/userController";
import { formatTemperature } from "../../utils/unitConverter";
import WeatherCardSkeleton from "../layout/WeatherCardSkeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  const weatherState = useSelector((state) => state.weather);
  const favorites = useSelector((state) => state.user.favorites);
  const user = useSelector((state) => state.auth.user);
  const unit = useSelector((state) => state.settings.unit);

  const weatherCards = useMemo(
    () => Object.values(weatherState.currentByCity),
    [weatherState.currentByCity],
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  const onSearch = (event) => {
    event.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeatherByCity(city.trim()));
    }
  };

  const onFavorite = (name) => {
    if (!user) return;
    dispatch(addFavoriteCity(name));
  };

  return (
    <section className="space-y-6">
      <form
        onSubmit={onSearch}
        className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="h-12 flex-1 rounded-2xl border border-white/20 bg-slate-950/40 px-4 text-white outline-none transition-all duration-300 focus:border-cyan-400"
            placeholder="Search city weather..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Search
          </button>
          <button
            type="button"
            className="h-12 rounded-2xl bg-white/15 px-6 font-medium transition-all duration-300 hover:scale-105"
            onClick={() => dispatch(fetchFavorites())}
          >
            Refresh Favorites
          </button>
        </div>
      </form>

      {weatherState.status === "loading" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <WeatherCardSkeleton />
          <WeatherCardSkeleton />
          <WeatherCardSkeleton />
        </div>
      ) : null}

      {weatherState.error ? (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/20 p-4 text-rose-100">
          {weatherState.error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {weatherCards.map((item) => (
          <article
            key={item.city}
            className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold">{item.city}</h2>
            <p className="mt-3 text-4xl font-bold">
              {formatTemperature(item.temperature, unit)}
            </p>
            <p className="mt-2 text-slate-200">{item.condition}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-300">
              <p>Humidity: {item.humidity}%</p>
              <p>Wind: {item.windSpeed} km/h</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                className="rounded-xl bg-white/15 px-3 py-2 text-sm transition-all duration-300 hover:scale-105"
                onClick={() => navigate(`/city/${encodeURIComponent(item.city)}`)}
              >
                Details
              </button>
              <button
                className="rounded-xl bg-cyan-500/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105"
                onClick={() => onFavorite(item.city)}
              >
                Add to Favorites
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
        <h3 className="mb-3 text-lg font-semibold">Favorite Cities</h3>
        <div className="flex flex-wrap gap-2">
          {favorites.length ? (
            favorites.map((fav) => (
              <Link
                key={fav.id || fav.name}
                className="rounded-full bg-white/15 px-4 py-2 text-sm transition-all duration-300 hover:scale-105"
                to={`/city/${encodeURIComponent(fav.name)}`}
              >
                {fav.name}
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-300">No favorites yet.</p>
          )}
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
