import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout, loadCurrentUser } from "../../controllers/authController";
import { toggleDarkMode, toggleUnit } from "../../store/settingsSlice";
import { getWeatherThemeBackground } from "../../utils/weatherTheme";

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.settings.darkMode);
  const unit = useSelector((state) => state.settings.unit);
  const selectedCity = useSelector((state) => state.weather.selectedCity);
  const selectedWeather = useSelector((state) =>
    selectedCity ? state.weather.currentByCity[selectedCity.toLowerCase()] : null,
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      window.localStorage.setItem("tap_auth_token", token);
      params.delete("token");
      const next = params.toString();
      const nextUrl = `${location.pathname}${next ? `?${next}` : ""}${location.hash || ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch, location.key]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <div
      className="min-h-screen px-4 py-6 md:px-8"
      style={{
        backgroundImage: getWeatherThemeBackground(
          selectedWeather?.condition,
          darkMode,
        ),
      }}
    >
      <header className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-slate-300/70 bg-white/70 px-4 py-3 text-slate-900 backdrop-blur-xl dark:border-white/20 dark:bg-white/10 dark:text-slate-100">
        <Link to="/" className="text-lg font-semibold tracking-wide">
          TapTalent Weather
        </Link>
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl bg-slate-200/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-slate-300/70 dark:bg-white/15 dark:hover:bg-white/25"
            onClick={() => dispatch(toggleUnit())}
          >
            {unit === "celsius" ? "Switch to degF" : "Switch to degC"}
          </button>
          <button
            className="rounded-xl bg-slate-200/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-slate-300/70 dark:bg-white/15 dark:hover:bg-white/25"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {user ? (
            <Link
              to="/settings"
              className="rounded-xl bg-slate-200/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-slate-300/70 dark:bg-white/15 dark:hover:bg-white/25"
            >
              Settings
            </Link>
          ) : null}
          {user && location.pathname !== "/auth" ? (
            <button
              className="rounded-xl bg-red-500/70 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl">{children}</main>
    </div>
  );
};

export default AppLayout;
