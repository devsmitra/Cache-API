import { Router } from "express";
import {
  getData,
  getKeys,
  removeAll,
  removeKey,
  setData,
} from "../controllers/Cache.controller";

const cacheRouter = Router();

cacheRouter.post("/keys/:key", setData);
cacheRouter.get("/keys/:key", getData);
cacheRouter.delete("/keys/:key", removeKey);
cacheRouter.get("/keys", getKeys);
cacheRouter.delete("/keys", removeAll);

export default cacheRouter;
