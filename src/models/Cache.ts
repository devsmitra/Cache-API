export const SchemaName = "Cache";
export const CacheSchema = {
  value: { type: String, required: true },
  key: { type: String, required: true, index: true },
};
