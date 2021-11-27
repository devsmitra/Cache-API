import { CACHE_MAX_AGE } from "../config/Environment";

export const SchemaName = "Cache";

export interface ICache {
  key: string;
  value: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  expires: Date;
}

export const CacheSchema = {
  count: { type: Number, required: true, default: 1 },
  value: { type: String, required: true },
  key: { type: String, required: true, index: true },
  expires: { type: Date, expires: CACHE_MAX_AGE },
};
