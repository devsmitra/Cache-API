import { Router } from "express";
import {
  getData,
  getKeys,
  removeAll,
  removeKey,
  setData,
} from "../controllers/CacheController";

const cacheRouter = Router();
cacheRouter.get("/keys", getKeys);
cacheRouter.post("/keys/:key", setData);
cacheRouter.get("/keys/:key", getData);
cacheRouter.delete("/keys/:key", removeKey);
cacheRouter.delete("/keys", removeAll);

// catch 404 and forward to error handler
cacheRouter.use(function (_req, res) {
  return res.json({
    message: "Not Found",
  });
});

export default cacheRouter;
