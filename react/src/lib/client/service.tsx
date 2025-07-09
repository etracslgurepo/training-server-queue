import { createFetchAsync, makeRequest } from "./fetch";

export const getService = (data: {}) => {
  return makeRequest("/api/service", {
    method: "GET",
    data,
  });
};

export const getPostService = (data: {}) => {
  return makeRequest("/api/service", {
    method: "POST",
    data: data,
  });
};

export type ServiceOptionType = {
  method?: "GET" | "POST";
  _connection?: string;
};

export const lookupService = (
  serviceName: string,
  connection?: string,
  option?: ServiceOptionType
) => {
  if (!option) option = { method: "POST" };
  if (!option.method) option.method = "POST";
  option._connection = connection;

  if (option.method === "GET") {
    return createFetchAsync(getService, serviceName, option);
  } else if (option.method === "POST") {
    return createFetchAsync(getPostService, serviceName, option);
  }
};
