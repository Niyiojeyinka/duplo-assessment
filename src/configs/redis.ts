import Redis from 'ioredis';
import environmentConfig from './environment';

const { REDIS_URL } = environmentConfig;
const redis = new Redis(REDIS_URL as string);

export default redis;
