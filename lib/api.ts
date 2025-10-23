import { mutate } from "swr";
import z, { ZodType } from "zod";
import { messages } from "./content";
import { ActionResponse, appMeta } from "./meta";
import { zodApiResponse } from "./zod";

export type ApiResponse<T> = z.infer<typeof zodApiResponse> & { data: T };
export type ApiFetcherConfig = Omit<RequestInit, "credentials">;

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

export function response<T>(
  code: number,
  jsonData: { message?: string; data?: T },
): ActionResponse<T> {
  const success = code >= 200 && code < 300;
  const { message = success ? "Sukses" : messages.error, data = null } =
    jsonData;
  return { code, success, message, data };
}

export async function apiFetcher<T>(
  url: string,
  schema: ZodType<T>,
  config?: ApiFetcherConfig,
): Promise<ApiResponse<T>> {
  return await fetcher(
    `${appMeta.apiHost}${url}`,
    zodApiResponse.extend({ data: schema }),
    config,
  );
}

export function apiMutate(key: string) {
  return mutate(`${appMeta.apiHost}${key}`);
}
