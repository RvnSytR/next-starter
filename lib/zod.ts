import { z } from "zod";
import { maxFileSize, type Media, media } from "./media";
import { capitalize } from "./utils";

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
        message: `${capitalize(mediaType)} size should not exceed ${maxFileSize[mediaType].mb} MB`,
      },
    );

export const zodAuth = z.object({
  id: z.string(),
  role: z.string().nullable().optional(),

  name: z
    .string({
      required_error: "Please enter your name.",
      invalid_type_error: "Name must be a valid text or string.",
    })
    .trim()
    .min(1, "Name cannot be empty."),

  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a valid text.",
    })
    .trim()
    .email("Please enter a valid email address.")
    .min(1, "Email cannot be empty.")
    .max(255, "Email is too long. Maximum 255 characters allowed."),

  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a valid text or string.",
    })
    .trim()
    .min(1, "Password cannot be empty.")
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password is too long. Maximum 128 characters allowed."),

  confirmPassword: z
    .string({
      required_error: "Please confirm your password.",
      invalid_type_error: "Confirm Password must be a valid text or string.",
    })
    .min(1, "Confirm Password cannot be empty."),

  rememberMe: z.boolean({
    invalid_type_error: "Remember Me must be a boolean value.",
  }),

  isAgree: z
    .boolean({
      required_error: "Agreement is required",
      invalid_type_error: "Agreement must be a boolean value.",
    })
    .refine((value) => value === true, {
      message: "You must agree to the Terms of Service and Privacy Policy.",
    }),
});
