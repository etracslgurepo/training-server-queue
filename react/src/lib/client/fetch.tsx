"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ServiceOptionType } from "./service";

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

export type FetchRequest = {
  method?: string;
  data?: {
    __partnerid?: string;
    __service?: string;
    __method?: string;
    __connection?: string;
    [key: string]: any;
  };
  options?: RequestInit;
};

export const encodeArgs = (param: any) => {
  const initialArr: string[] = [];
  return Object.keys(param)
    .reduce((arr, key) => {
      if (param.hasOwnProperty(key)) {
        arr.push(`${key}=${param[key]}`);
      } else {
        arr;
      }
      return arr;
    }, initialArr)
    .join("&");
};

export const getData = async (
  url: string,
  params: Record<string, any> = {},
  options: Record<string, any> = {}
): Promise<ResponseError | ResponseSuccess | ResponseRedirect> => {
  const args = {
    method: params.method,
    serviceName: params.serviceName,
    ...params.data,
  };
  const searchParams = encodeArgs(args);

  let res = undefined;

  try {
    res = await fetch(searchParams ? `${url}?${searchParams}` : url, options);
  } catch (err) {
    console.error("getData [ERROR]", err);
    return {
      code: "01",
      error: "Service is currently not available. Please try again later.",
      detail: err,
    } as ResponseError;
  }

  if (!res.ok) {
    console.error("getData [ERROR]", res.statusText);
    return {
      code: "02",
      error:
        "Partner service did not respond on time. Please try again or contact Partner for assistance.",
      detail: res.statusText,
    } as ResponseError;
  }

  if (res.redirected) {
    return {
      redirect: true,
      url: res.url,
    } as ResponseRedirect;
  }

  try {
    const responseData = await res.json();
    if (responseData.error || responseData.status === "ERROR") {
      return {
        code: "03",
        error: responseData.error || responseData.msg,
      } as ResponseError;
    } else {
      return { data: responseData.data } as ResponseSuccess;
    }
  } catch (err) {
    console.error("getData [ERROR] to json: ", res.statusText);
    return {
      code: "04",
      error: "A data error is encountered. Please try again.",
      detail: res.statusText,
    } as ResponseError;
  }
};

export const postData = async (
  url: string,
  data?: {},
  options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }
) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
    if (res.ok) {
      return await res.json();
    } else {
      return { error: "A data error is encountered. Please try again." };
    }
  } catch (err) {
    console.error("postData [ERROR]", err);
    return {
      error: "Service is currently not available. Please try again later.",
    };
  }
};

export const putData = async (
  url: string,
  data?: {},
  options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }
): Promise<ResponseSuccess | ResponseError> => {
  try {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.error) {
        return {
          code: "01",
          error: data.error,
          detail: res.statusText,
        } as ResponseError;
      } else {
        return { data } as ResponseSuccess;
      }
    } else {
      return {
        code: "02",
        error: "A data error is encountered. Please try again.",
        detail: res.statusText,
      };
    }
  } catch (err) {
    console.error("postData [ERROR]", err);
    return {
      code: "03",
      error: "Service is currently not available. Please try again later.",
      detail: err as string,
    };
  }
};

export const deleteData = async (
  url: string,
  data?: {},
  options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }
): Promise<ResponseSuccess | ResponseError> => {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(data),
      ...options,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.error) {
        return { code: "01", error: data.error } as ResponseError;
      } else {
        return { data } as ResponseSuccess;
      }
    } else {
      return {
        code: "02",
        error: "A data error is encountered. Please try again.",
        detail: res.statusText,
      } as ResponseError;
    }
  } catch (err) {
    console.error("postData [ERROR]", err);
    return {
      code: "03",
      error: "Service is currently not available. Please try again later.",
      detail: err as string,
    };
  }
};

export const makeRequest = (
  url: string,
  request: FetchRequest = { method: "GET", data: {} }
): Promise<ResponseSuccess | ResponseRedirect | ResponseError> => {
  if ("GET" === request.method) {
    return getData(url, request.data, request.options);
  }

  if ("POST" === request.method) {
    return postData(url, request.data, request.options);
  }

  if ("PUT" === request.method) {
    return putData(url, request.data, request.options);
  }

  if ("DELETE" === request.method) {
    return deleteData(url, request.data, request.options);
  }

  throw Error(`Invalid ${request.method}`);
};

export const createFetchAsync = (
  func: (args: any) => any,
  serviceName: string,
  option: ServiceOptionType
) => {
  return CreateAsyncInternal(func, serviceName, false, option);
};

const CreateAsyncInternal = (
  func: (
    ...params: any[]
  ) => any | Promise<ResponseSuccess | ResponseRedirect | ResponseError>,
  serviceName: string,
  initialLoading = false,
  option: ServiceOptionType
) => {
  const [loading, setLoading] = useState(initialLoading);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<any | undefined>();
  const router = useRouter();

  const invoke = (...args: any[]) => {
    setLoading(true);
    setProcessing(true);

    let params = { serviceName, method: args[0], data: {}, option };
    if (args.length > 1) {
      params.data = args[1];
    }

    return func(params)
      .then((res: any) => {
        if (isResponseError(res)) {
          setError(res.error);
          setValue(undefined);
        } else {
          setValue(res.data);
          setError(undefined);
          if (res.data.redirect) {
            router.push(res.data.url);
          }
          return res.data;
        }
      })
      .finally(() => {
        setLoading(false);
        setProcessing(false);
      });
  };

  return { loading, processing, error, value, invoke };
};
