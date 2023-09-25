import dotenv from 'dotenv';

dotenv.config();

const { 
  PORT, DB_PASSWORD,
  DB_USERNAME, DB_NAME,
  DB_HOST,
  DB_PORT,
  NODE_ENV, JWT_SECRET,
  REDIS_URL
} = process.env;

interface EnvironmentConfig {
  PORT: number;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT?: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  REDIS_URL?: string;
};

const environmentConfig: EnvironmentConfig = {
  PORT: PORT ? parseInt(PORT) : 9000,
  DB_PASSWORD: DB_PASSWORD as string,
  DB_USERNAME: DB_USERNAME as string,
  DB_NAME: DB_NAME as string,
  DB_HOST: DB_HOST as string,
  NODE_ENV: NODE_ENV as string,
  JWT_SECRET: JWT_SECRET as string,
  DB_PORT: DB_PORT ? parseInt(DB_PORT as string) : 5432,
  REDIS_URL: REDIS_URL as string,
};

export default environmentConfig;
