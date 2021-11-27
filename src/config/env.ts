import * as dotenv from "dotenv";
dotenv.config();

export const DB_URI = process.env.DB_URI;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
