import { LucideIcon, Mars, Venus } from "lucide-react";

export type Toast = "success" | "error" | "info" | "warning";

export const gender = ["male", "female"] as const;
export type Gender = (typeof gender)[number];
export const genderMeta: Record<
  Gender,
  { displayName: string; icon: LucideIcon; badgeClassName: string }
> = {
  male: {
    displayName: "Laki-laki",
    icon: Mars,
    badgeClassName: "border-sky-500 text-sky-500",
  },
  female: {
    displayName: "Perempuan",
    icon: Venus,
    badgeClassName: "border-pink-500 text-pink-500",
  },
};

export const languages = ["en", "id", "es", "fr", "de", "ar"] as const;
export type Languages = (typeof languages)[number];
export const languagesMeta: Record<
  Languages,
  { locale: string; currency: string; decimal: number; symbol: string }
> = {
  en: { locale: "en-US", currency: "USD", decimal: 2, symbol: "$" },
  id: { locale: "id-ID", currency: "IDR", decimal: 0, symbol: "Rp" },
  de: { locale: "de-DE", currency: "EUR", decimal: 2, symbol: "€" },
  es: { locale: "es-ES", currency: "EUR", decimal: 2, symbol: "€" },
  fr: { locale: "fr-FR", currency: "EUR", decimal: 2, symbol: "€" },
  ar: { locale: "ar-SA", currency: "SAR", decimal: 2, symbol: "ر.س" },
};
