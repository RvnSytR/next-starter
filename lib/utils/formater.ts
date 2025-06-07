export function capitalize(str: string) {
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function sanitizeNumber(str: string): number {
  return Number(str.replace(/[^\d]/g, "") || "0");
}

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
