import { z } from "zod";
import { id } from "zod/locales";
import { FileType, fileMeta } from "./const";
import { baseContent, messages } from "./content";
import { toMegabytes } from "./utils";

const cUser = baseContent.user;
const cUserFields = cUser.fields;

z.config(id());

export const zodDateRange = z.object(
  {
    from: z.date({ error: messages.invalid.dateRange.from }),
    to: z.date({ error: messages.invalid.dateRange.to }),
  },
  { error: messages.invalid.dateRange.field },
);

export const zodFile = (
  type: FileType,
  options?: {
    optional?: boolean;
    min?: number;
    max?: number;
    maxSize?: number;
  },
) => {
  const { size, mimeTypes } = fileMeta[type];
  const { type: fileType, tooLarge, tooShort, tooLong } = messages.file;

  const optional = options?.optional ?? false;
  const min = options?.min ?? 1;
  const max = options?.max;
  const maxSize = options?.maxSize ?? size.bytes;

  let sc = z.array(
    z
      .file()
      .mime(mimeTypes, { error: fileType(type) })
      .min(1)
      .max(maxSize, { error: tooLarge(type, toMegabytes(maxSize).toFixed(2)) }),
  );

  if (!optional) sc = sc.min(min, { error: tooShort(type, options) });
  if (max && max > 0) sc = sc.max(max, { error: tooLong(type, max) });

  return sc;
};

export const zodUser = z.object({
  id: z.string(),
  role: z.string(),
  name: z
    .string({
      error: messages.requiredAndInvalidField(cUserFields.name.label, "string"),
    })
    .trim()
    .min(1, { error: messages.tooShort(cUserFields.name.label, 1) }),
  email: z
    .email({ error: messages.invalid.email })
    .trim()
    .min(1, { error: messages.tooShort(cUserFields.email.label, 1) })
    .max(255, { error: messages.tooLong(cUserFields.email.label, 255) }),
  password: z
    .string({
      error: messages.requiredAndInvalidField(
        cUserFields.password.label,
        "string",
      ),
    })
    .trim()
    .min(8, { error: messages.tooShort(cUserFields.password.label, 8) })
    .max(255, { error: messages.tooLong(cUserFields.password.label, 255) }),
  confirmPassword: z
    .string({
      error: messages.requiredAndInvalidField(
        cUserFields.confirmPassword.label,
        "string",
      ),
    })
    .min(1, { error: messages.tooShort(cUserFields.confirmPassword.label, 1) }),
  rememberMe: z.boolean({
    error: messages.requiredAndInvalidField(cUserFields.rememberMe, "boolean"),
  }),
  revokeOtherSessions: z.boolean({
    error: messages.requiredAndInvalidField(
      "Sign out from other devices",
      "boolean",
    ),
  }),
  isAgree: z
    .boolean({
      error: messages.requiredAndInvalidField("Agreement", "boolean"),
    })
    .refine((v) => v, { error: cUser.agreement }),
});

export const zodUserSignUp = zodUser
  .pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
    isAgree: true,
  })
  .refine((sc) => sc.password === sc.confirmPassword, {
    message: cUser.passwordNotMatch,
    path: ["confirmPassword"],
  });

export const zodUserChangePassword = z
  .object({
    currentPassword: zodUser.shape.password,
    newPassword: zodUser.shape.password,
    confirmPassword: zodUser.shape.confirmPassword,
    revokeOtherSessions: zodUser.shape.revokeOtherSessions,
  })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: cUser.passwordNotMatch,
    path: ["confirmPassword"],
  });

export const zodUserCreate = zodUser
  .pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
    role: true,
  })
  .refine((sc) => sc.password === sc.confirmPassword, {
    message: cUser.passwordNotMatch,
    path: ["confirmPassword"],
  });
