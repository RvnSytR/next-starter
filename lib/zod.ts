import { z } from "zod";
import { maxFileSize, type Media, media } from "./media";
import { Capitalize } from "./utils";

export const zodFile = (mediaType: Media) =>
  z
    .instanceof(File)
    .array()
    .nonempty({ message: `At least one ${mediaType} file is required` })
    .refine(
      (files) =>
        files.every((file) => media[mediaType].type.includes(file.type)),
      { message: `Invalid ${mediaType} file type` },
    )
    .refine(
      (files) =>
        files.every((file) => file.size <= maxFileSize[mediaType].byte),
      {
        message: `${Capitalize(mediaType)} size should not exceed ${maxFileSize[mediaType].mb} MB`,
      },
    );

export const zodAuth = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(1, "Name cannot be empty."),
  email: z
    .string()
    .email("Invalid email address.")
    .trim()
    .min(1, "Email cannot be empty.")
    .max(255, "Email is too long."),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .trim()
    .min(1, "Password cannot be empty.")
    .min(8, "Password must be at least 8 characters long."),
  rememberMe: z.boolean({ invalid_type_error: "isActive must be a boolean" }),
});
