import Service, {
  ResponseData as ServiceResponseData,
  ResponseError as ServiceResponseError,
  ResponseRedirect as ServiceResponseRedirect,
  ResponseSuccess as ServiceResponseSuccess,
  getHandler,
  postHandler,
} from "./service";

export type ResponseData = ServiceResponseData;
export type ResponseError = ServiceResponseError;
export type ResponseSuccess = ServiceResponseSuccess;
export type ResponseRedirect = ServiceResponseRedirect;

export { Service, getHandler, postHandler };
