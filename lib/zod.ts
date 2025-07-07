import { z } from "zod/v4";
import { FileType, mediaMeta } from "./const";
import { messages } from "./content";

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
  const { size, mimeType } = mediaMeta[type];
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

export const zodAuth = z.object({
  id: z.string(),
  role: z.string().optional(),
  name: z
    .string({ error: messages.requiredAndInvalidField("Name", "string") })
    .trim()
    .min(1, { error: messages.tooShort("Name", 1) }),
  email: z
    .email({ error: messages.invalid.email })
    .trim()
    .min(1, { error: messages.tooShort("Email", 1) })
    .max(255, { error: messages.tooShort("Email", 255) }),
  password: z
    .string({ error: messages.requiredAndInvalidField("Password", "string") })
    .trim()
    .min(1, { error: messages.tooShort("Password", 1) })
    .min(8, { error: messages.tooShort("Password", 8) })
    .max(255, { error: messages.tooShort("Password", 255) }),
  confirmPassword: z
    .string({
      error: messages.requiredAndInvalidField("Confirm Password", "string"),
    })
    .min(1, { error: messages.tooShort("Confirm Password", 1) }),
  rememberMe: z.boolean({
    error: messages.requiredAndInvalidField("Remember Me", "boolean"),
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
    .refine((v) => v === true, { error: messages.user.agreement }),
});
