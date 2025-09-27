import { z } from "zod";
import { id } from "zod/locales";
import { messages } from "./content";
import { fieldsMeta, fileMeta, FileType } from "./meta";
import { allRoles } from "./permission";
import { toMegabytes } from "./utils";

z.config(id());

const { user: userFields } = fieldsMeta;

export const zodSchemas = {
  string: (field: string, options?: { min?: number; max?: number }) => {
    let schema = z.string().trim();

    const { required, stringTooShort, stringTooLong } = messages;
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
    let schema = z.number();

    const { required, numberTooSmall, numberTooLarge } = messages;
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
    .email({ error: messages.invalid(userFields.email.label) })
    .trim()
    .toLowerCase()
    .min(1, { error: messages.required(userFields.email.label) })
    .max(255, { error: messages.stringTooLong(userFields.email.label, 255) }),

  password: z
    .string()
    .min(1, { error: messages.required(userFields.password.label) })
    .min(8, { error: messages.stringTooShort(userFields.password.label, 8) })
    .max(255, { error: messages.stringTooLong(userFields.password.label, 255) })
    .regex(/[A-Z]/, {
      error: `${userFields.password.label} harus mengandung huruf kapital. (A-Z)`,
    })
    .regex(/[a-z]/, {
      error: `${userFields.password.label} harus mengandung huruf kecil. (a-z)`,
    })
    .regex(/[0-9]/, {
      error: `${userFields.password.label} harus mengandung angka. (0-9)`,
    })
    .regex(/[^A-Za-z0-9]/, {
      error: `${userFields.password.label} harus mengandung karakter khusus.`,
    }),

  updatedAt: z.coerce.date({ error: `${fieldsMeta.updatedAt} tidak valid.` }),
  createdAt: z.coerce.date({ error: `${fieldsMeta.createdAt} tidak valid.` }),

  date: z.coerce.date({ error: "Pilih tanggal yang valid." }),

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
      maxSize?: number;
    },
  ) => {
    const { displayName, size, mimeTypes } = fileMeta[type];

    const optional = options?.optional ?? false;
    const min = options?.min ?? 1;
    const max = options?.max;

    const maxSize = options?.maxSize ?? size.bytes;
    const maxSizeInMB = toMegabytes(maxSize).toFixed(2);

    let schema = z.array(
      z
        .file()
        .mime(mimeTypes, { error: `Tipe ${displayName} tidak valid.` })
        .min(1)
        .max(maxSize, {
          error: `Ukuran ${displayName} tidak boleh melebihi ${maxSizeInMB} MB.`,
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

export const zodUser = z.object({
  role: z.enum(allRoles),
  email: zodSchemas.email,
  name: zodSchemas.string(userFields.name.label, { min: 1 }),

  password: zodSchemas.string(userFields.password.label, { min: 1 }),
  newPassword: zodSchemas.password,
  confirmPassword: zodSchemas.string(userFields.confirmPassword.label, {
    min: 1,
  }),
  currentPassword: zodSchemas.string(userFields.currentPassword.label, {
    min: 1,
  }),

  rememberMe: z.boolean(),
  revokeOtherSessions: z.boolean(),
  agreement: z.boolean().refine((v) => v, {
    error:
      "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
  }),
});
