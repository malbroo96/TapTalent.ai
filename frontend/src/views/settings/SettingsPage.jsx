import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, toggleUnit } from "../../store/settingsSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { unit, darkMode } = useSelector((state) => state.settings);

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-xl bg-slate-950/40 p-4">
        <h2 className="text-lg">Temperature Unit</h2>
        <p className="mb-3 mt-1 text-sm text-slate-300">Current: {unit}</p>
        <button
          className="rounded-xl bg-white/15 px-4 py-2 transition-all duration-300 hover:scale-105"
          onClick={() => dispatch(toggleUnit())}
        >
          Toggle Unit
        </button>
      </div>
      <div className="rounded-xl bg-slate-950/40 p-4">
        <h2 className="text-lg">Theme</h2>
        <p className="mb-3 mt-1 text-sm text-slate-300">
          Current: {darkMode ? "dark" : "light"}
        </p>
        <button
          className="rounded-xl bg-white/15 px-4 py-2 transition-all duration-300 hover:scale-105"
          onClick={() => dispatch(toggleDarkMode())}
        >
          Toggle Theme
        </button>
      </div>
    </section>
  );
};

export default SettingsPage;
