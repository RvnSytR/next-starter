import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { ZodType } from "zod";
import { fetcher } from "../utils";

export function useValidatedSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: { fetcher?: RequestInit; swr?: SWRConfiguration },
): SWRResponse<T> {
  const fn = async () => await fetcher(key, schema, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}
