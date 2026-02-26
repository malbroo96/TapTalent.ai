import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout, loadCurrentUser } from "../../controllers/authController";
import { toggleDarkMode, toggleUnit } from "../../store/settingsSlice";

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.settings.darkMode);
  const unit = useSelector((state) => state.settings.unit);

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <header className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl">
        <Link to="/" className="text-lg font-semibold tracking-wide">
          TapTalent Weather
        </Link>
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl bg-white/15 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-white/25"
            onClick={() => dispatch(toggleUnit())}
          >
            {unit === "celsius" ? "Switch to degF" : "Switch to degC"}
          </button>
          <button
            className="rounded-xl bg-white/15 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-white/25"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {user ? (
            <Link
              to="/settings"
              className="rounded-xl bg-white/15 px-3 py-2 text-sm transition-all duration-300 hover:scale-105 hover:bg-white/25"
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
