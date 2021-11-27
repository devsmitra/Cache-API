import mongoose, { Schema } from "mongoose";
import { log } from "../helpers/Logger";
import { CacheSchema, SchemaName } from "../models/Cache";
import { DB_PASSWORD, DB_USER, DB_URI } from "./Environment";

// Create database connection
export const createConnection = async (): Promise<typeof mongoose> => {
  const conn = await mongoose.connect(
    `mongodb+srv://${DB_URI}?retryWrites=true&w=majority`,
    {
      user: DB_USER,
      pass: DB_PASSWORD,
    }
  );
  // Register schemas with the connection
  registerSchema(conn, SchemaName, CacheSchema);
  log("Connected to MongoDB");
  return conn;
};

// Register a schema with the connection
const registerSchema = (conn: typeof mongoose, name: string, schema: any) => {
  const CacheSchema = new Schema(schema, {
    timestamps: true,
  });
  conn.model(SchemaName, CacheSchema);
};

// Get the model from the connection by name
export const getModel = mongoose.model;
