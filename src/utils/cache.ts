import redis from "../configs/redis";

const buildCacheKey = (key: string) => {
  return `rise-${key}`;
}

const setCache = async (key: string, data: any, expiryInHours: number = 24 ) => {
  const cacheKey = buildCacheKey(key);
  await redis.expire(cacheKey, expiryInHours * 60 * 60);
  await redis.set(cacheKey, JSON.stringify(data));
}

const getCache = async (key: string) => {
  try {
  const cacheKey = buildCacheKey(key);
  const data = await redis.get(cacheKey);
  return JSON.parse(data as string);
  } catch (e) {
    return null;
  }
} 

export {
  setCache,
  getCache
}
