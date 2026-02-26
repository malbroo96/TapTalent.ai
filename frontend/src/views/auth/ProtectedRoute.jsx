import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import WeatherCardSkeleton from "../layout/WeatherCardSkeleton";

const ProtectedRoute = ({ children }) => {
  const { user, initialized, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized || status === "loading") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
