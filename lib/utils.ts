import { clsx, type ClassValue } from "clsx";
import { format, isAfter, isBefore } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export const maxFileSize = { mb: 1, byte: FormatToByte(1) };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// #region // * Get Random Things
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
// #endregion

// #region // * Formater
export function FormatToByte(mb: number) {
  return mb * 1000 * 1000;
}

export function FormatToMegabyte(byte: number) {
  return byte / 1000 / 1000;
}

export function Capitalize(str: string) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export function SanitizeNumber(str: string) {
  return str.replace(/[^\d]/g, "") || "0";
}

export function FormatNumeric(
  num: string | number,
  prefix: string = "",
): string {
  if (!num) return `${prefix}0`;
  const value = new Intl.NumberFormat("id-ID").format(Number(num) || 0);
  return `${prefix}${value}`;
}

export function FormatPhone(num: string | number): string {
  const phoneStr = SanitizeNumber(num.toString());
  if (phoneStr.length <= 3) return phoneStr;

  let formatted = phoneStr.slice(0, 3);
  let remaining = phoneStr.slice(3);
  while (remaining.length > 0) {
    formatted += "-" + remaining.slice(0, 4);
    remaining = remaining.slice(4);
  }

  return formatted;
}
// #endregion

// #region // * Date
export function FormatDate(date: Date, formatStr: string) {
  return format(date, formatStr, { locale: id });
}

export function IsDateInRange(from: Date, to: Date, date: Date) {
  return isBefore(from, date) && isAfter(to, date);
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
// #endregion

// #region // TODO Image Reader
function ReadFileAsURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

async function GetFilesAsURL(files: File[] | null) {
  if (!files || !files.every((file) => file.type.startsWith("image/")))
    throw new Error("Invalid file(s) provided!");
  const results: string[] = [];
  for (const item of files) {
    if (item.size > maxFileSize.byte)
      throw new Error("Ukuran File Terlalu Besar!");
    results.push(await ReadFileAsURL(item));
  }
  return results;
}

export async function FileOnChangeAsURL(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  if (!event.target.files) return [];
  return await GetFilesAsURL(Array.from(event.target.files));
}
// #endregion
