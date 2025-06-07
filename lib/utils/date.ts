import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { id } from "date-fns/locale";

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

export function formatDate(date: Date, formatStr: string) {
  return format(date, formatStr, { locale: id });
}

export function formatDateDistanceToNow(date: Date) {
  return formatDistanceToNow(date, { locale: id });
}

export function formatSecondsToDHMS(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}
