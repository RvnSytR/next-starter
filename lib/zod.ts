import { z } from "zod";
import { id } from "zod/locales";
import { messages } from "./content";
import { fieldsMeta, fileMeta, FileType } from "./meta";
import { allRoles } from "./permission";
import { toMegabytes } from "./utils";

z.config(id());

const { user: userFields } = fieldsMeta;

export const zodSchemas = {
  string: (field: string) => z.string().trim().min(1, messages.required(field)),

  email: z
    .email({ error: messages.invalid(userFields.email.label) })
    .trim()
    .min(1, { error: messages.required(userFields.email.label) })
    .max(255, { error: messages.tooLong(userFields.email.label, 255) }),

  password: z
    .string()
    .min(1, { error: messages.required(userFields.password.label) })
    .min(8, { error: messages.tooShort(userFields.password.label, 8) })
    .max(255, { error: messages.tooLong(userFields.password.label, 255) })
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

  date: z.date({ error: "Pilih tanggal yang valid." }),

  dateMultiple: z.array(z.date({ error: "Pilih tanggal yang valid." }), {
    error: "Beberapa tanggal yang dimasukkan tidak valid.",
  }),

  dateRange: z.object(
    {
      from: z.date({ error: "Pilih tanggal mulai yang valid." }),
      to: z.date({ error: "Pilih tanggal akhir yang valid." }),
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
  name: z
    .string()
    .min(1, { error: messages.tooShort(userFields.name.label, 1) }),

  password: zodSchemas.string(userFields.password.label),
  newPassword: zodSchemas.password,
  confirmPassword: zodSchemas.string(userFields.confirmPassword.label),
  currentPassword: zodSchemas.string(userFields.currentPassword.label),

  rememberMe: z.boolean(),
  revokeOtherSessions: z.boolean(),
  agreement: z.boolean().refine((v) => v, {
    error:
      "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
  }),
});
