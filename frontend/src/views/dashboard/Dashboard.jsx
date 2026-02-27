import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from "../../controllers/weatherController";
import { removeWeatherCity } from "../../store/weatherSlice";
import {
  addFavoriteCity,
  fetchFavorites,
  removeFavoriteCity,
} from "../../controllers/userController";
import { indiaCities } from "../../utils/indiaCities";
import { formatTemperature } from "../../utils/unitConverter";
import WeatherCardSkeleton from "../layout/WeatherCardSkeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const weatherState = useSelector((state) => state.weather);
  const favorites = useSelector((state) => state.user.favorites);
  const user = useSelector((state) => state.auth.user);
  const unit = useSelector((state) => state.settings.unit);

  const weatherCards = useMemo(
    () => Object.values(weatherState.currentByCity),
    [weatherState.currentByCity],
  );
  const suggestionPool = useMemo(() => {
    const knownCities = [
      ...favorites.map((item) => item.name),
      ...weatherCards.map((item) => item.city),
      ...indiaCities,
    ];
    return [...new Set(knownCities.filter(Boolean))];
  }, [favorites, weatherCards]);
  const filteredSuggestions = useMemo(() => {
    const query = city.trim().toLowerCase();
    if (query.length < 2) {
      return [];
    }
    const startsWithQuery = suggestionPool.filter((name) =>
      name.toLowerCase().startsWith(query),
    );
    const includesQuery = suggestionPool.filter(
      (name) =>
        !name.toLowerCase().startsWith(query) &&
        name.toLowerCase().includes(query),
    );
    return [...startsWithQuery, ...includesQuery].slice(0, 8);
  }, [city, suggestionPool]);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user || weatherCards.length > 0) {
      return;
    }

    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          fetchWeatherByCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        );
      },
      () => {
        // If denied or unavailable, keep manual search flow.
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [dispatch, user, weatherCards.length]);

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

  const onDeleteFavorite = (name) => {
    if (!user) return;
    dispatch(removeFavoriteCity(name));
  };
  const onDeleteWeatherCard = (name) => {
    dispatch(removeWeatherCity(name));
  };

  const onSuggestionSelect = (name) => {
    setCity(name);
    setShowSuggestions(false);
  };

  return (
    <section className="space-y-6">
      <form
        onSubmit={onSearch}
        className="relative z-30 rounded-2xl border border-slate-300/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/20 dark:bg-white/10"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative z-40 flex-1">
            <input
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-400 dark:border-white/20 dark:bg-slate-950/40 dark:text-white"
              placeholder="Search city weather..."
              value={city}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 120);
              }}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
            />
            {showSuggestions && filteredSuggestions.length ? (
              <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-slate-300/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/95">
                {filteredSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-800 transition-all duration-300 hover:bg-slate-200/70 dark:text-slate-100 dark:hover:bg-white/15"
                    onMouseDown={(event) => {
                      // Keep focus on input until click handler runs.
                      event.preventDefault();
                    }}
                    onClick={() => onSuggestionSelect(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Search
          </button>
          <button
            type="button"
            className="h-12 rounded-2xl bg-slate-200/70 px-6 font-medium transition-all duration-300 hover:scale-105 dark:bg-white/15"
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
            className="rounded-2xl border border-slate-300/70 bg-white/80 p-5 text-slate-900 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-white/20 dark:bg-white/10 dark:text-slate-100"
          >
            <h2 className="text-xl font-semibold">{item.city}</h2>
            <p className="mt-3 text-4xl font-bold">
              {formatTemperature(item.temperature, unit)}
            </p>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{item.condition}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <p>Humidity: {item.humidity}%</p>
              <p>Wind: {item.windSpeed} km/h</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                className="rounded-xl bg-slate-200/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 dark:bg-white/15"
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
              {!weatherState.defaultCity ||
              item.city.toLowerCase() !== weatherState.defaultCity.toLowerCase() ? (
                <button
                  className="rounded-xl bg-rose-500/80 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => onDeleteWeatherCard(item.city)}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {favorites.length ? (
        <section className="rounded-2xl border border-slate-300/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/20 dark:bg-white/10">
          <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Favorite Cities</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <div
                key={fav.id || fav.name}
                className="flex items-center gap-2 rounded-full bg-slate-200/70 px-4 py-2 text-sm text-slate-800 transition-all duration-300 hover:scale-105 dark:bg-white/15 dark:text-slate-100"
              >
                <Link to={`/city/${encodeURIComponent(fav.name)}`}>{fav.name}</Link>
                <button
                  type="button"
                  aria-label={`Delete ${fav.name} from favorites`}
                  className="rounded-full bg-rose-500/80 px-2 py-0.5 text-xs text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => onDeleteFavorite(fav.name)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
};

export default Dashboard;
