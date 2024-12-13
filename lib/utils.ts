import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LABEL } from "@/components/content";

export type cv = ClassValue;

export function cn(...inputs: cv[]) {
  return twMerge(clsx(inputs));
}

export function Delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function GetRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result as string;
}

export function GetRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color as string;
}

export function Capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function FormatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function NumberWithDots(num: number) {
  return num.toLocaleString("de-DE");
}

export function DotsToNumber(numWithDots: string) {
  return parseFloat(numWithDots.replace(/\./g, ""));
}

export function CalculateAge(birthDate: Date): number | string {
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    throw new Error("Invalid date format. Please provide a valid date.");
  }

  if (birthDate > today) {
    throw new Error("Invalid date. The date cannot be in the future.");
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

// #region // * File Reader
function ReadFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

async function GetFilesAsDataURL(files: File[] | null, maxFileSize?: number) {
  if (!files || !files.every((file) => file.type.startsWith("image/")))
    throw new Error("Invalid file(s) provided!");
  const results: string[] = [];
  for (const item of files) {
    if (maxFileSize && item.size > maxFileSize * 1024 * 1024)
      throw new Error(LABEL.error.fileSize);
    results.push(await ReadFileAsDataURL(item));
  }
  return results;
}

export async function FileOnChangeAsURL(
  event: React.ChangeEvent<HTMLInputElement>,
  maxFileSizeInMb?: number,
) {
  if (!event.target.files) return [];
  return await GetFilesAsDataURL(
    Array.from(event.target.files),
    maxFileSizeInMb,
  );
}
// #endregion
