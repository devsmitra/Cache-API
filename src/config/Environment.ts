// Only for development purposes
import * as dotenv from "dotenv";
dotenv.config();

const env = process.env;

// Database config
export const { DB_URI, DB_USER, DB_PASSWORD } = env;

// Cache config
export const CACHE_MAX_ENTRIES = isNaN(Number(env.CACHE_MAX_ENTRIES))
  ? Number(env.CACHE_MAX_ENTRIES)
  : 2;
export const CACHE_MAX_AGE = isNaN(Number(env.CACHE_MAX_AGE))
  ? Number(env.CACHE_MAX_AGE)
  : 3600;
