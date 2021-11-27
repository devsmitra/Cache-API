import { Request, Response } from "express";
import mongoose from "mongoose";
import { getModel } from "../config/db";
import { SchemaName } from "../models/Cache";
import { log } from "../helpers/Logger.helper";
import { generateText } from "../helpers/TextGenerator";

export const setData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const Cache = getModel(SchemaName);
  const { value } = req.body;
  const { key } = req.params;
  const data = await Cache.findOneAndUpdate(
    { key },
    {
      value,
      key,
    },
    {
      new: true,
      upsert: true,
    }
  );

  // const data = await insertCache(req.body);
  return res.status(200).send({
    message: "Cache Created",
    data,
  });
};

export const getData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { key } = req.params;
  try {
    const Cache = getModel(SchemaName);
    let data = await Cache.findOne({
      key,
    });
    if (data === null) {
      log("Cache miss");
      data = await new Cache({
        value: generateText(10),
        key,
      }).save();
    } else {
      log("Cache hit");
    }
    return res.status(200).send({
      message: "Cache Data",
      data,
    });
  } catch (error) {
    log(error);
    return res.status(500).send({
      message: "Something went wrong",
      error,
    });
  }
};

export const getKeys = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const Cache = getModel(SchemaName);
  const data = await Cache.find({}, "key -_id");
  // TODO: Add pagination and change response to array
  return res.status(200).send({
    message: "Cache Keys",
    data,
  });
};

export const removeKey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { key } = req.params;
  const Cache = getModel(SchemaName);
  const data = await Cache.findOneAndDelete({
    key,
  });
  return res.status(200).send({
    message: "Cache Key Removed",
    data,
  });
};

export const removeAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const Cache = getModel(SchemaName);
  const data = await Cache.deleteMany({});
  return res.status(200).send({
    message: "Cache Removed",
    data,
  });
};
