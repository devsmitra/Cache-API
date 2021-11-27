const mockingoose = require("mockingoose");
import { getData, getKeys, removeKey, setData } from "./CacheController";
import { Request, Response } from "express";
import { SchemaName } from "../models/Cache";

const req: Request = {
  body: {},
  params: {},
} as Request;

const res: Response = {
  status: (code: number) => res,
  json: (data: any) => data,
} as Response;
describe("Cache Controller", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  it("Should set the data", async () => {
    const _doc = [
      {
        _id: "61a23290d593def98d99b965",
        key: "41",
        count: 1,
        createdAt: "2021-11-27T13:28:48.410Z",
        expires: "2021-11-27T15:23:31.369Z",
        updatedAt: "2021-11-27T14:23:31.370Z",
        value: "MyGI9sPH8q",
      },
    ];

    mockingoose(SchemaName).toReturn(_doc, "find");
    mockingoose(SchemaName).toReturn(_doc[0], "findOneAndUpdate");
    const data = await setData(req, res);
    expect(data).toBeDefined();
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual({
      message: "Cache Created",
      data: _doc[0],
    });
  });

  it("Should return the record", async () => {
    const _doc = [
      {
        _id: "61a23290d593def98d99b965",
        key: "41",
        count: 1,
        createdAt: "2021-11-27T13:28:48.410Z",
        expires: "2021-11-27T15:23:31.369Z",
        updatedAt: "2021-11-27T14:23:31.370Z",
        value: "MyGI9sPH8q",
      },
    ];
    mockingoose(SchemaName).toReturn(_doc[0], "findOne");
    mockingoose(SchemaName).toReturn(_doc, "find");
    mockingoose(SchemaName).toReturn(_doc[0], "findOneAndUpdate");

    const data = await getData(req, res);
    expect(data).toBeDefined();
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual({
      message: "Cache Data",
      data: _doc[0],
    });
  });

  it("Should create and return the record", async () => {
    const _req: Request = {
      body: {},
      params: { key: "42" },
    } as unknown as Request;

    const _doc = {
      _id: "61a23290d593def98d99b965",
      key: "41",
      count: 1,
      createdAt: "2021-11-27T13:28:48.410Z",
      expires: "2021-11-27T15:23:31.369Z",
      updatedAt: "2021-11-27T14:23:31.370Z",
      value: "MyGI9sPH8q",
    };
    mockingoose(SchemaName).toReturn(null, "findOne");
    mockingoose(SchemaName).toReturn([], "find");
    mockingoose(SchemaName).toReturn(_doc, "findOneAndUpdate");

    const data = await getData(_req, res);
    expect(data).toBeDefined();
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual({
      message: "Cache Data",
      data: _doc,
    });
  });

  it("Should return all the record keys", async () => {
    const _doc = [{ key: "41" }];
    mockingoose(SchemaName).toReturn(_doc, "find");
    const data = await getKeys(req, res);
    expect(data).toBeDefined();
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual({
      message: "Cache Keys",
      data: _doc.map((item: any) => item.key),
    });
  });

  it("Should remove record", async () => {
    const _doc = {
      _id: "61a20334cfee8db5b7236082",
      value: "yiAFFFmzZ5",
      key: "121",
      count: 1,
      createdAt: "2021-11-27T10:06:44.790Z",
      updatedAt: "2021-11-27T10:06:44.790Z",
    };
    mockingoose(SchemaName).toReturn(_doc, "findOneAndDelete");

    const data = await removeKey(req, res);
    expect(data).toBeDefined();
    expect(JSON.parse(JSON.stringify(data))).toStrictEqual({
      message: "Cache Key Removed",
      data: _doc,
    });
  });

  it("Should remove all the records", async () => {
    const _doc = {
      deletedCount: -3,
    };
    mockingoose(SchemaName).toReturn(_doc, "deleteMany");
    const data = await removeKey(req, res);
    expect(data).toBeDefined();
  });
});
