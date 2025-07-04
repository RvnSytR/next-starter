import { message } from "@/lib/content";
import { z } from "zod/v4";
import { FileType, mediaMeta } from "./const";

export const zodFile = (type: FileType) => {
  const { size, mimeType } = mediaMeta[type];
  return z
    .array(
      z
        .file()
        .min(1)
        .max(size.byte, { error: message.fileTooLarge(type, size.mb) })
        .mime(mimeType, { error: message.invalidFileType(type) }),
    )
    .min(1, { error: message.fileRequired(type) });
};

export const zodAuth = z.object({
  id: z.string(),
  role: z.string().optional(),
  name: z
    .string({ error: message.requiredAndInvalidField("Name", "string") })
    .trim()
    .min(1, { error: message.tooShort("Name", 1) }),
  email: z
    .email({ error: message.invalidEmail })
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
