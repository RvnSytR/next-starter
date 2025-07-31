import { z } from "zod";
import { id } from "zod/locales";
import { FileType, fileMeta } from "./const";
import { baseContent, messages } from "./content";

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
  options?: { optional?: boolean; max?: number },
) => {
  const { size, mimeType } = fileMeta[type];
  const maxFileSize = options?.max ?? size.byte;

  let schema = z.array(
    z
      .file()
      .min(1)
      .max(maxFileSize, { error: messages.fileTooLarge(type, size.mb) })
      .mime(mimeType, { error: messages.invalid.fileType(type) }),
  );

  if (!options?.optional)
    schema = schema.min(1, { error: messages.fileRequired(type) });

  return schema.refine((f) => f.every(({ size }) => size <= maxFileSize), {
    error: messages.fileTooLarge(type, size.mb),
  });
};

export const zodUser = z.object({
  id: z.string(),
  role: z.string().optional(),
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
    .max(255, { error: messages.tooShort(cUserFields.email.label, 255) }),
  password: z
    .string({
      error: messages.requiredAndInvalidField(
        cUserFields.password.label,
        "string",
      ),
    })
    .trim()
    .min(1, { error: messages.tooShort(cUserFields.password.label, 1) })
    .min(8, { error: messages.tooShort(cUserFields.password.label, 8) })
    .max(255, { error: messages.tooShort(cUserFields.password.label, 255) }),
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

export const zodAuthSignUp = zodUser
  .pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
    isAgree: true,
  })
  .refine((sc) => sc.password === sc.confirmPassword, {
    message: cUser.confirmPassword,
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
    message: cUser.confirmPassword,
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
    message: cUser.confirmPassword,
    path: ["confirmPassword"],
  });
