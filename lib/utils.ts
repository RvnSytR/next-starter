import { ClassValue, clsx } from "clsx";
import { format, isAfter, isBefore } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { media } from "./media";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

//#region // * Arrays
export function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter((x) => b.includes(x));
}

export function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}

export function take<T>(a: T[], n: number): T[] {
  return a.slice(0, n);
}

export function flatten<T>(a: T[][]): T[] {
  return a.flat();
}
// #endregion

// #region // * Get Random Things
export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result as string;
}

export function getRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color as string;
}
// #endregion

// #region // * Formater
export function toByte(mb: number) {
  return mb * 1024 * 1024;
}

export function toMegabytes(byte: number) {
  return byte / 1024 / 1024;
}

export function toKebabCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export function formatNumeric(
  num: string | number,
  prefix: string = "",
): string {
  return `${prefix}${new Intl.NumberFormat("id-ID").format(sanitizeNumber(String(num)))}`;
}

export function formatPhone(num: string | number): string {
  const phoneStr = String(sanitizeNumber(String(num)));
  if (!phoneStr || phoneStr === "0") return "";
  if (phoneStr.length <= 3) return phoneStr;

  let formatted = phoneStr.slice(0, 3);
  let remaining = phoneStr.slice(3);
  while (remaining.length > 0) {
    formatted += "-" + remaining.slice(0, 4);
    remaining = remaining.slice(4);
  }

  return formatted;
}

export function capitalize(str: string) {
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function sanitizeNumber(str: string): number {
  return Number(str.replace(/[^\d]/g, "") || "0");
}

// #endregion

// #region // * Date
export function formatDate(date: Date, formatStr: string) {
  return format(date, formatStr, { locale: id });
}

export function isDateInRange(from: Date, to: Date, date: Date) {
  return isBefore(from, date) && isAfter(to, date);
}

export function calculateAge(birthDate: Date): number | string {
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
function readFileAsURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

async function getFilesAsURL(files: File[] | null) {
  if (!files || !files.every((file) => file.type.startsWith("image/")))
    throw new Error("Invalid file(s) provided!");
  const results: string[] = [];
  for (const item of files) {
    if (item.size > media.image.size.byte)
      throw new Error("Ukuran File Terlalu Besar!");
    results.push(await readFileAsURL(item));
  }
  return results;
}

export async function fileOnChangeAsURL(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  if (!event.target.files) return [];
  return await getFilesAsURL(Array.from(event.target.files));
}
// #endregion
