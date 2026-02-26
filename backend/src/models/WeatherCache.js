import mongoose from "mongoose";

const weatherCacheSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      index: true,
    },
    cacheType: {
      type: String,
      enum: ["current", "forecast"],
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

weatherCacheSchema.index({ city: 1, cacheType: 1 }, { unique: true });

const WeatherCache = mongoose.model("WeatherCache", weatherCacheSchema);

export default WeatherCache;
