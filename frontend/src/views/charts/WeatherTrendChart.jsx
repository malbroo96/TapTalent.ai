import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WeatherTrendChart = ({ data, dataKey = "temp", stroke = "#38bdf8", fill = "#0ea5e9" }) => {
  return (
    <div className="h-72 w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={fill} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
          <XAxis dataKey="label" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{
              borderRadius: "0.75rem",
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            fill="url(#gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherTrendChart;
