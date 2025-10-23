import { ZodType } from "zod";
import { messages } from "../content";
import { ActionResponse } from "../meta";

export async function fetcher<T>(
  url: string,
  schema: ZodType<T>,
  config?: RequestInit,
): Promise<T> {
  const res = await fetch(url, config);
  const json = await res.json();
  if (!res.ok) throw json;
  if (!schema) return json;
  return schema.parse(json);
}

export function apiResponse<T>(
  code: number,
  jsonData: { message?: string; data?: T },
): ActionResponse<T> {
  const success = code >= 200 && code < 300;
  const { message = success ? "Sukses" : messages.error, data = null } =
    jsonData;
  return { code, success, message, data };
}
