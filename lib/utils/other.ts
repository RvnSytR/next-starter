import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActionResponse } from "../meta";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const actionResponse = <T>(
  success: boolean,
  messages: string,
  options?: { code?: number; data?: T },
): ActionResponse<T> => ({
  code: options?.code ?? (success ? 200 : 500),
  success,
  messages,
  data: options?.data ?? null,
});
