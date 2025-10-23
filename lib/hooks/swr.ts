import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { ZodType } from "zod";
import { fetcher } from "../api";
import { appMeta } from "../meta";

type UseValidatedSWRConfig = { swr?: SWRConfiguration; fetcher?: RequestInit };

export function useValidatedSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: UseValidatedSWRConfig,
): SWRResponse<T> {
  const fn = async () => await fetcher(key, schema, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}

export function useApiSWR<T>(
  key: string,
  schema: ZodType<T>,
  config?: Pick<UseValidatedSWRConfig, "swr"> &
    Omit<Pick<UseValidatedSWRConfig, "fetcher">, "credentials">,
): SWRResponse<T> {
  return useValidatedSWR(`${appMeta.apiHost}${key}`, schema, {
    swr: config?.swr,
    fetcher: { credentials: "include", ...config?.fetcher },
  });
}
