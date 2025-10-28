import { z } from "zod";
import { id } from "zod/locales";
import { allGenders, fileMeta, FileType } from "../constants";
import { toMegabytes } from "../utils";
import { messages } from "./content";
import { allRoles } from "./permission";

z.config(id());

export const zodSchemas = {
  string: (field: string, options?: { min?: number; max?: number }) => {
    const { invalidType, required, stringTooShort, stringTooLong } = messages;
    let schema = z.string({ error: invalidType(field, "string") }).trim();

    const min = options?.min;
    const max = options?.max;

    if (min) {
      const message = min <= 1 ? required : stringTooShort;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) schema = schema.max(max, { error: stringTooLong(field, max) });

    return schema;
  },

  number: (field: string, options?: { min?: number; max?: number }) => {
    const { invalidType, required, numberTooSmall, numberTooLarge } = messages;
    let schema = z.number({ error: invalidType(field, "number") });

    const min = options?.min;
    const max = options?.max;

    if (min) {
      const message = min <= 1 ? required : numberTooSmall;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) schema = schema.max(max, { error: numberTooLarge(field, max) });

    return schema;
  },

  email: z
    .email({ error: messages.invalid("Alamat email") })
    .trim()
    .toLowerCase()
    .min(1, { error: messages.required("Alamat email") })
    .max(255, { error: messages.stringTooLong("Alamat email", 255) }),

  password: z
    .string()
    .min(1, { error: messages.required("Kata sandi") })
    .min(8, { error: messages.stringTooShort("Kata sandi", 8) })
    .max(255, { error: messages.stringTooLong("Kata sandi", 255) })
    .regex(/[A-Z]/, {
      error: `Kata sandi harus mengandung huruf kapital. (A-Z)`,
    })
    .regex(/[a-z]/, {
      error: `Kata sandi harus mengandung huruf kecil. (a-z)`,
    })
    .regex(/[0-9]/, {
      error: `Kata sandi harus mengandung angka. (0-9)`,
    })
    .regex(/[^A-Za-z0-9]/, {
      error: `Kata sandi harus mengandung karakter khusus.`,
    }),

  gender: z.enum(allGenders),

  updatedAt: z.coerce.date({ error: "Field 'updatedAt' tidak valid." }),
  createdAt: z.coerce.date({ error: "Field 'createdAt' tidak valid." }),

  date: (field?: string) =>
    z.coerce.date({
      error: `Pilih tanggal${field ? `${field.toLowerCase()} ` : ""} yang valid.`,
    }),

  dateMultiple: z.array(z.coerce.date({ error: "Pilih tanggal yang valid." }), {
    error: "Beberapa tanggal yang dimasukkan tidak valid.",
  }),

  dateRange: z.object(
    {
      from: z.coerce.date({ error: "Pilih tanggal mulai yang valid." }),
      to: z.coerce.date({ error: "Pilih tanggal akhir yang valid." }),
    },
    { error: "Pilih rentang tanggal yang valid." },
  ),

  file: (
    type: FileType,
    options?: {
      optional?: boolean;
      min?: number;
      max?: number;
      maxFileSize?: number;
    },
  ) => {
    const { displayName, size, mimeTypes } = fileMeta[type];

    const optional = options?.optional ?? false;
    const min = optional ? 0 : options?.min || 1;
    const max = options?.max;

    const maxFileSize = options?.maxFileSize ?? size.bytes;
    const maxFileSizeInMB = toMegabytes(maxFileSize).toFixed(2);

    let schema = z.array(
      z
        .file()
        .mime(mimeTypes, { error: `Tipe ${displayName} tidak valid.` })
        .min(1)
        .max(maxFileSize, {
          error: `Ukuran ${displayName} tidak boleh melebihi ${maxFileSizeInMB} MB.`,
        }),
    );

    if (!optional) {
      const message = `Silakan unggah minimal ${min} ${displayName}.`;
      schema = schema.min(min, { error: message });
    }

    if (max && max > 0) {
      const message = `Jumlah maksimum ${displayName} yang dapat diunggah adalah ${max}.`;
      schema = schema.max(max, { error: message });
    }

    return schema;
  },
};

export const zodApiResponse = z.object({
  code: z.number(),
  message: z.string(),
  success: z.boolean(),
});

export const zodUser = z.object({
  role: z.enum(allRoles),
  email: zodSchemas.email,
  name: zodSchemas.string("Nama", { min: 1 }),

  password: zodSchemas.string("Kata sandi", { min: 1 }),
  newPassword: zodSchemas.password,
  confirmPassword: zodSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: zodSchemas.string("Kata sandi saat ini", { min: 1 }),

  rememberMe: z.boolean(),
  revokeOtherSessions: z.boolean(),
  agreement: z.boolean().refine((v) => v, {
    error:
      "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
  }),
});
