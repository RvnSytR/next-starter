import { role, user } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const zodUserSchema = createSelectSchema(user, {
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
  username: (sc) =>
    sc
      .trim()
      .min(1, "Username cannot be empty.")
      .max(255, "Username is too long."),
  role: z.enum(role, { required_error: "Please select a user role." }),
});
