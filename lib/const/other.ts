import { LucideIcon, Mars, Venus } from "lucide-react";

export type Action = "created" | "updated" | "removed" | "uploaded";
export type Toast = "success" | "error" | "info" | "warning";

export type FieldType =
  | "string"
  | "boolean"
  | "number"
  | "date"
  | "array"
  | "object";

export type FileType =
  | "file"
  | "image"
  | "document"
  | "archive"
  | "audio"
  | "video";

export const languages = ["en", "id", "es", "fr", "de", "ar"] as const;
export type Languages = (typeof languages)[number];
export const languagesMeta: Record<
  Languages,
  { locale: string; currency: string }
> = {
  en: { locale: "en-US", currency: "USD" },
  id: { locale: "id-ID", currency: "IDR" },
  de: { locale: "de-DE", currency: "EUR" },
  es: { locale: "es-ES", currency: "EUR" },
  fr: { locale: "fr-FR", currency: "EUR" },
  ar: { locale: "ar-SA", currency: "SAR" },
};

export const gender = ["male", "female"] as const;
export type Gender = (typeof gender)[number];
export const genderMetadata: Record<
  Gender,
  { displayName: string; icon: LucideIcon; className: string }
> = {
  male: {
    displayName: "Male",
    icon: Mars,
    className: "border-sky-500 text-sky-500",
  },
  female: {
    displayName: "Female",
    icon: Venus,
    className: "border-pink-500 text-pink-500",
  },
};
