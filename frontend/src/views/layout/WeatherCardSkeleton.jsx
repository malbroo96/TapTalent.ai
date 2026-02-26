const WeatherCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-4 h-5 w-2/5 rounded bg-white/20" />
      <div className="mb-3 h-8 w-1/3 rounded bg-white/20" />
      <div className="h-4 w-3/4 rounded bg-white/20" />
    </div>
  );
};

export default WeatherCardSkeleton;
