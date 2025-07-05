import { message } from "@/lib/content";
import { z } from "zod/v4";
import { FileType, mediaMeta } from "./const";

export const zodDateRange = z.object(
  {
    from: z.date({ error: message.invalid.dateRange.from }),
    to: z.date({ error: message.invalid.dateRange.to }),
  },
  { error: message.invalid.dateRange.field },
);

export const zodFile = (
  type: FileType,
  options?: { optional?: boolean; max?: number },
) => {
  const { size, mimeType } = mediaMeta[type];
  const maxFileSize = options?.max ?? size.byte;

  let schema = z.array(
    z
      .file()
      .min(1)
      .max(maxFileSize, { error: message.fileTooLarge(type, size.mb) })
      .mime(mimeType, { error: message.invalid.fileType(type) }),
  );

  if (!options?.optional)
    schema = schema.min(1, { error: message.fileRequired(type) });

  return schema.refine((f) => f.every(({ size }) => size <= maxFileSize), {
    error: message.fileTooLarge(type, size.mb),
  });
};

export const zodAuth = z.object({
  id: z.string(),
  role: z.string().optional(),
  name: z
    .string({ error: message.requiredAndInvalidField("Name", "string") })
    .trim()
    .min(1, { error: message.tooShort("Name", 1) }),
  email: z
    .email({ error: message.invalid.email })
    .trim()
    .min(1, { error: message.tooShort("Email", 1) })
    .max(255, { error: message.tooShort("Email", 255) }),
  password: z
    .string({ error: message.requiredAndInvalidField("Password", "string") })
    .trim()
    .min(1, { error: message.tooShort("Password", 1) })
    .min(8, { error: message.tooShort("Password", 8) })
    .max(255, { error: message.tooShort("Password", 255) }),
  confirmPassword: z
    .string({
      error: message.requiredAndInvalidField("Confirm Password", "string"),
    })
    .min(1, { error: message.tooShort("Confirm Password", 1) }),
  rememberMe: z.boolean({
    error: message.requiredAndInvalidField("Remember Me", "boolean"),
  }),
  revokeOtherSessions: z.boolean({
    error: message.requiredAndInvalidField(
      "Sign out from other devices",
      "boolean",
    ),
  }),
  isAgree: z
    .boolean({ error: message.requiredAndInvalidField("Agreement", "boolean") })
    .refine((v) => v === true, { error: message.user.agreement }),
});
