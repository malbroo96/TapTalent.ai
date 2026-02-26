// 60-second in-memory cache for weather responses.
const CACHE_TTL_MS = 60 * 1000;
const memoryCache = new Map();

export const getCachedValue = (key) => {
  const entry = memoryCache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp >= CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedValue = (key, data) => {
  memoryCache.set(key, {
    city: key.split(":")[1],
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = () => {
  memoryCache.clear();
};
