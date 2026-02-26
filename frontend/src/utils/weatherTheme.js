const themeByCondition = {
  clear: {
    light:
      "radial-gradient(circle at 5% 10%, #fde68a 0%, #fcd34d 22%, #fef3c7 58%, #fff7ed 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #f59e0b 0%, #7c2d12 32%, #1f2937 70%, #020617 100%)",
  },
  clouds: {
    light:
      "radial-gradient(circle at 5% 10%, #dbeafe 0%, #bfdbfe 28%, #e2e8f0 62%, #f8fafc 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #64748b 0%, #334155 32%, #1e293b 68%, #020617 100%)",
  },
  rain: {
    light:
      "radial-gradient(circle at 5% 10%, #bae6fd 0%, #7dd3fc 24%, #93c5fd 58%, #eff6ff 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #0ea5e9 0%, #1e3a8a 35%, #0f172a 70%, #020617 100%)",
  },
  thunderstorm: {
    light:
      "radial-gradient(circle at 5% 10%, #ddd6fe 0%, #c4b5fd 26%, #e2e8f0 60%, #f8fafc 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #7c3aed 0%, #312e81 35%, #0f172a 70%, #020617 100%)",
  },
  snow: {
    light:
      "radial-gradient(circle at 5% 10%, #f0f9ff 0%, #e0f2fe 24%, #f1f5f9 62%, #ffffff 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #93c5fd 0%, #1d4ed8 35%, #0f172a 70%, #020617 100%)",
  },
  mist: {
    light:
      "radial-gradient(circle at 5% 10%, #e2e8f0 0%, #cbd5e1 30%, #e5e7eb 62%, #f8fafc 100%)",
    dark:
      "radial-gradient(circle at 5% 10%, #94a3b8 0%, #334155 34%, #111827 68%, #020617 100%)",
  },
};

const fallbackTheme = {
  light:
    "radial-gradient(circle at 0% 0%, #c8e3ff 0%, #eef5ff 52%, #f8fafc 100%)",
  dark:
    "radial-gradient(circle at 0% 0%, #1f3b66 0%, #0b1020 45%, #04070e 100%)",
};

export const getWeatherThemeBackground = (condition = "", darkMode = true) => {
  const key = condition.toLowerCase();
  const theme = themeByCondition[key] || fallbackTheme;
  return darkMode ? theme.dark : theme.light;
};

