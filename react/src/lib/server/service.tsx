import type { NextApiRequest, NextApiResponse } from "next";
import Service from "./remote-service";

export type ResponseSuccess = {
  data: any;
};

export type ResponseRedirect = {
  redirect: boolean;
  url: string;
};

export type ResponseError = {
  code: string;
  error: string;
  detail?: string;
};

export type ResponseData = {
  status: "SUCCESS" | "ERROR";
  data: {};
};

export type FetchResponse = ResponseError | ResponseSuccess | ResponseRedirect;

export function isResponseSuccess(data: any): data is ResponseSuccess {
  return typeof data === "object" && "data" in data;
}

export function isResponseError(data: any): data is ResponseError {
  return typeof data === "object" && "code" in data && "error" in data;
}

export function isResponseRedirect(data: any): data is ResponseRedirect {
  return typeof data === "object" && "redirect" in data && "url" in data;
}

export async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
  services: {}
) {
  try {
    const data = req.query;
    const serviceName = data.serviceName + "";
    const method = data.method + "";
    const result = await executeService(services, serviceName, method, data);
    return res.status(200).json({ status: "SUCCESS", data: result });
  } catch (error) {
    return res.status(401).json({ code: "01", error: error + "" });
  }
}

export async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
  services: {}
) {
  try {
    const { serviceName, method, data, option } = req.body;
    const result = await executeService(
      services,
      serviceName,
      method,
      data,
      option
    );
    return res.status(200).json({ status: "SUCCESS", data: result });
  } catch (error) {
    return res.status(401).json({ code: "01", error: error + "" });
  }
}

async function executeService(
  services: Record<string, any> = {},
  serviceName: string,
  method: string,
  data = {},
  option: Record<string, any> = {}
) {
  console.log(`\n\n>>>${serviceName}.${method}<<<`);
  console.log(data);
  console.log("=================================\n\n");
  let svc = services[serviceName];
  if (svc) {
    const func = svc[method];
    let result = {};
    if (isAsync(func)) {
      result = await func(data);
    } else {
      result = func(data);
    }
    return result;
  } else {
    console.log("ServiceName", serviceName);
    console.log("method", method);
    svc = Service.lookup(serviceName, option._connection);
    return await svc.invoke(method, data);
  }
}

const isAsync = (func: any) => {
  return func.constructor.name === "AsyncFunction";
};

export default Service;
