import { role, user } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { maxFileSize } from "./utils";

export const imgType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
];

export const docType = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const zodFile = {
  image: z
    // .instanceof(FileList)
    .unknown()
    .transform((value) => value as FileList)
    .refine(
      (files) => Array.from(files).every((file) => imgType.includes(file.type)),
      { message: "Invalid image file type" },
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= maxFileSize.byte),
      { message: `Image size should not exceed ${maxFileSize.mb} MB` },
    ),

  document: z
    // .instanceof(FileList)
    .unknown()
    .transform((value) => value as FileList)
    .refine(
      (files) => Array.from(files).every((file) => docType.includes(file.type)),
      { message: "Invalid document file type" },
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= maxFileSize.byte),
      { message: `Document size should not exceed ${maxFileSize.mb} MB` },
    ),
};

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
