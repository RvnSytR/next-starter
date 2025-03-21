import { role, user } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
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

export const zodUser = createSelectSchema(user, {
  role: z.enum(role, { required_error: "Please select a user role." }),
  username: (sc) =>
    sc
      .trim()
      .min(1, "Username cannot be empty.")
      .max(255, "Username is too long."),
  email: (sc) =>
    sc
      .email("Please enter a valid email address.")
      .trim()
      .min(1, "Email cannot be empty.")
      .max(255, "Email is too long."),
  password: (sc) =>
    sc
      .trim()
      .min(1, "Password cannot be empty.")
      .min(8, "Password must be at least 8 characters long.")
      .max(255, "Password is too long."),
});

export const zodChangePassword = z
  .object({
    currentPassword: zodUser.shape.password,
    newPassword: zodUser.shape.password,
    confirmPassword: zodUser.shape.password,
  })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
