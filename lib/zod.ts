import { RawCreateParams, z } from "zod";
import { FieldType, FileCategory, mediaMetadata } from "./const";
import { zodMessage } from "./content";
import { capitalize } from "./utils";

const zodParams = {
  create: (thing: string, type?: FieldType) =>
    ({
      required_error: zodMessage.required(thing),
      invalid_type_error: zodMessage.invalidType(thing, type),
    }) as RawCreateParams,
};

export const zodFile = (category: FileCategory) => {
  const fileMedia = mediaMetadata[category];
  const mediaFileType = category !== "all" ? category : "file";

  return z
    .instanceof(File)
    .array()
    .nonempty({ message: zodMessage.atleastOne(mediaFileType) })
    .refine(
      (files) =>
        files.every(
          ({ type }) =>
            fileMedia.type.includes("*") || fileMedia.type.includes(type),
        ),
      { message: zodMessage.invalidFileType(mediaFileType) },
    )
    .refine(
      (files) => files.every((file) => file.size <= fileMedia.size.byte),
      {
        message: `${capitalize(mediaFileType)} size should not exceed ${fileMedia.size.mb} MB.`,
      },
    );
};

export const zodAuth = z.object({
  id: z.string(),
  role: z.string().nullable().optional(),

  name: z
    .string(zodParams.create("Name"))
    .trim()
    .min(1, zodMessage.cannotEmpty("Name")),

  email: z
    .string(zodParams.create("Email"))
    .trim()
    .email(zodMessage.email)
    .min(1, zodMessage.cannotEmpty("Email"))
    .max(255, zodMessage.toLong("Email", 255)),

  password: z
    .string(zodParams.create("Password"))
    .trim()
    .min(1, zodMessage.cannotEmpty("Password"))
    .min(8, zodMessage.toShort("Password", 8))
    .max(128, zodMessage.toLong("Password", 128)),

  confirmPassword: z
    .string(zodParams.create("Confirm password"))
    .min(1, zodMessage.cannotEmpty("Confirm password")),

  rememberMe: z.boolean(zodParams.create("Remember me", "boolean")),

  revokeOtherSessions: z.boolean(
    zodParams.create("Sign out from other devices", "boolean"),
  ),

  isAgree: z
    .boolean(zodParams.create("Agreement", "boolean"))
    .refine((v) => v === true, { message: zodMessage.agreement }),
});
