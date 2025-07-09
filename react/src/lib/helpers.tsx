import cryptoJs from "crypto-js";
import { v4 as uuidv4 } from "uuid";

export const md5Encode = (values = []) => {
  return cryptoJs.MD5(values.join("")).toString();
};

export function decodeQrCode(qrcode: string) {
  return { tokenid: atob(qrcode + "") };
}

export function generateQrCode(data: string) {
  return btoa(data);
}

export const isArray = (value: any) => {
  return Array.isArray(value);
};

export const oid = (prefix = "") => {
  return `${prefix ?? ""}${uuidv4()}`;
};

export const extractSearchParams = (url: any) => {
  const query: Record<string, any> = {};
  for (let pair of url.searchParams.entries()) {
    query[pair[0]] = pair[1];
  }
  return query;
};

export const logc = (caption: string, ...data: any) => {
  console.log("\n\n");
  console.log(`${caption}=====================`);
  console.log(data);
  console.log(`${caption}=====================`);
};

export const randomChars = (length = 10) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isAsync = (func: any) => {
  return func.constructor.name === "AsyncFunction";
};
