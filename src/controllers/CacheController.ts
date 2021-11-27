import { Request, Response } from "express";
import { getModel } from "../config/Database";
import { ICache, SchemaName } from "../models/Cache";
import { log } from "../helpers/Logger";
import { generateText } from "../helpers/TextGenerator";
import { CACHE_MAX_AGE, CACHE_MAX_ENTRIES } from "../config/Environment";

type Record = {
  [key: string]: any;
};

/**
 * Determine expiration time for cache record
 *
 * @returns Date
 */
const getExpiration = () => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + CACHE_MAX_AGE);
  return now;
};

/**
 * @param records : Array<ICache>
 * @param filter : Record
 * @returns : number
 */
const getCounter = (records: ICache[], filter: Record) =>
  records.length
    ? (records.find((item) => item.key === filter.key)?.count ?? 0) + 1
    : 1;

/*
  For cache eviction, LRU(least recently used) policy has been implemented.
  The cache is evicted when the number of entries exceeds the maximum number of entries. That can be configured in the environment.
  LRU is calculated by the number of times a key has been accessed(count) and the time of the last access(expires).

  The eviction policy is implemented by the following logic:
    1. For every upsert request, reset the count and expiration time(TTL) of the record
    2. For every get request, increment the count and expiration time(TTL) of the record
    3. Check the least recently used record and evict it.

    Following cases are covered:
      1. Cache is empty and insert the first record
      2. If the cache is not empty and not full, insert a new record
      3. If the cache is not empty and full, evict the least recently used record and insert a new record

    Edge cases:
      1. If 2 records have the same expiration time, the one with the lowest count will be evicted first
      2. If 2 records have the same count, the one with the lowest expiration time will be evicted first
      3. If 2 records have the same count and expiration time, the one which created first(createdAt) will be evicted first

    Additional checks:
      1. If the record is expired, it will be removed from the cache using MongoDB's expires check for Date type.
*/

/**
 * Insert/Update cache record
 * @param filter: Record;
 * @param data: Record;
 * @returns Cache
 
 */
const upsertKey = async (filter: Record, data: Record) => {
  let _filter = filter;
  const Cache = getModel<ICache>(SchemaName);

  // Get existing record in descending order by  time
  const records = await Cache.find(
    {},
    { expires: 1, _id: 1, count: 1, key: 1 }
  ).sort({
    expires: 1,
    count: 1,
  });

  // Check if records limit is reached if so, remove update record with lowest expiration time
  if (records.length && records.length >= CACHE_MAX_ENTRIES) {
    _filter = {
      _id: records[0]._id.toString(),
    };
  }

  return Cache.findOneAndUpdate(
    _filter,
    {
      ...data,
      expires: getExpiration(),
      count: getCounter(records, filter),
    },
    {
      new: true,
      upsert: true,
    }
  );
};

/**
 * Insert/Update cache record
 * @param req: Request;
 * @param res: Response;
 * @returns Promise<Response>
 */
export const setData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { value } = req.body;
  const { key } = req.params;
  try {
    const data = await upsertKey(
      { key },
      {
        value,
        key,
      }
    );
    return res.status(200).json({
      message: "Cache Created",
      data,
    });
  } catch (error) {
    log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

/**
 * Get cache record by key
 * @param req : Request;
 * @param res : Response;
 * @returns : Promise<Response>
 */
export const getData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { key } = req.params;
  try {
    const query = {
      key,
    };
    const Cache = getModel<ICache>(SchemaName);

    // Get existing record and update expiration time
    let data = await Cache.findOne(query);

    // If record not found, create new record with random value
    if (data === null) {
      log("Cache miss");
      data = await upsertKey(query, {
        value: generateText(10),
        key,
      });
    } else {
      log("Cache hit");
      data = await upsertKey(query, {
        expires: getExpiration(),
      });
    }
    return res.status(200).json({
      message: "Cache Data",
      data,
    });
  } catch (error) {
    log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

/**
 * Get all records keys
 *
 * @param req : Request;
 * @param res : Response;
 * @returns : Promise<Response>
 */
export const getKeys = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const Cache = getModel<ICache>(SchemaName);
    const data = await Cache.find({}, "key -_id")
      .sort("-updatedAt")
      .limit(CACHE_MAX_ENTRIES);

    return res.status(200).json({
      message: "Cache Keys",
      data: data.map((item: any) => item.key),
    });
  } catch (error) {
    log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

/**
 * Remove cache record by key
 *
 * @param req : Request;
 * @param res : Response;
 * @returns : Promise<Response>
 */
export const removeKey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { key } = req.params;
    const Cache = getModel<ICache>(SchemaName);
    const data = await Cache.findOneAndDelete({
      key,
    });

    return res.status(200).json({
      message: "Cache Key Removed",
      data,
    });
  } catch (error) {
    log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

/**
 * Remove all cache records
 *
 * @param req : Request;
 * @param res : Response;
 * @returns : Promise<Response>
 */
export const removeAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const Cache = getModel<ICache>(SchemaName);
    const data = await Cache.deleteMany({});
    return res.status(200).json({
      message: "Cache Removed",
      data,
    });
  } catch (error) {
    log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
