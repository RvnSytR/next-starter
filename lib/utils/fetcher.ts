import { ZodType } from "zod";

export async function fetcher<T>(
  url: string,
  schema: ZodType<T>,
  config?: RequestInit,
): Promise<T> {
  const res = await fetch(url, config);
  const json = await res.json();

  if (!res.ok) throw json;
  if (!schema) return json;

  try {
    return schema.parse(json);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
