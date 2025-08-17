import { appInfo, Languages, languagesMeta } from "../const";

export function capitalize(str: string) {
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function sanitizeNumber(str: string): number {
  const normalized = str
    .replace(/\u0660/g, "0")
    .replace(/\u0661/g, "1")
    .replace(/\u0662/g, "2")
    .replace(/\u0663/g, "3")
    .replace(/\u0664/g, "4")
    .replace(/\u0665/g, "5")
    .replace(/\u0666/g, "6")
    .replace(/\u0667/g, "7")
    .replace(/\u0668/g, "8")
    .replace(/\u0669/g, "9");
  return Number(normalized.replace(/[^\d]/g, "") || "0");
}

export function toBytes(mb: number) {
  return mb * 1024 * 1024;
}

export function toMegabytes(bytes: number) {
  return bytes / 1024 / 1024;
}

export function toKebabCase(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export function getCurrencySymbol(lang: Languages): string {
  const { locale, currency } = languagesMeta[lang];
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(1);
  return formatted.replace(/[\d\s.,]/g, "").trim();
}

export function formatNumber(
  number: number,
  props?: { lang?: Languages; options?: Intl.NumberFormatOptions },
) {
  const locale = languagesMeta[props?.lang ?? appInfo.lang].locale;
  return new Intl.NumberFormat(locale, props?.options).format(number);
}

export function formatPhone(number: number, prefix?: "+62" | "0") {
  const phoneStr = String(number);
  if (!phoneStr || phoneStr === "0") return "";
  if (phoneStr.length <= 3) return phoneStr;

  let formatted = phoneStr.slice(0, 3);
  let remaining = phoneStr.slice(3);
  while (remaining.length > 0) {
    formatted += "-" + remaining.slice(0, 4);
    remaining = remaining.slice(4);
  }

  return `${prefix ?? ""}${formatted}`.trim();
}
