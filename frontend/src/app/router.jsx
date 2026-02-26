import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../views/auth/ProtectedRoute";
import WeatherCardSkeleton from "../views/layout/WeatherCardSkeleton";

const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const CityDetails = lazy(() => import("../views/city/CityDetails"));
const SettingsPage = lazy(() => import("../views/settings/SettingsPage"));
const AuthPage = lazy(() => import("../views/auth/AuthPage"));

const withSuspense = (node) => (
  <Suspense
    fallback={
      <div className="grid gap-4 md:grid-cols-2">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
    }
  >
    {node}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: withSuspense(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>,
        ),
      },
      {
        path: "city/:name",
        element: withSuspense(
          <ProtectedRoute>
            <CityDetails />
          </ProtectedRoute>,
        ),
      },
      {
        path: "settings",
        element: withSuspense(
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: "auth",
        element: withSuspense(<AuthPage />),
      },
    ],
  },
]);
