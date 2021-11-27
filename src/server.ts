import express, { Application, NextFunction, Request, Response } from "express";
import createError from "http-errors";

// App Modules
import "./config/Environment";
import { createConnection } from "./config/Database";
import cacheRouter from "./routes/Cache.route";
import { log, logError } from "./helpers/Logger";

const app: Application = express();
const port = 3000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cacheRouter);

const run = async (): Promise<void> => {
  try {
    // Connect to the database
    await createConnection();

    // Start the server
    app.listen(port, (): void => {
      log(`Connected successfully on port ${port}`);
    });
  } catch (error: any) {
    logError(`Error occurred: ${error.message}`);
  }
};
run();
