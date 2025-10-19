import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActionResponse } from "../meta";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export function apiResponse<T>(
  code: number,
  jsonData: { message: string; data?: T },
): ActionResponse<T> {
  const success = code >= 200 && code < 300;
  const { message, data = null } = jsonData;
  return { code, success, message, data };
}
