import express, { Application, NextFunction, Request, Response } from "express";
import createError from "http-errors";

// Modules
import "./config/env";
import { createConnection } from "./config/db";
import cacheRouter from "./routes/Cache.route";

const app: Application = express();
const port = 3000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cacheRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const run = async (): Promise<void> => {
  try {
    await createConnection();
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  } catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
  }
};
run();
