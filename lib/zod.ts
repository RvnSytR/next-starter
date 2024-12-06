import { user } from "./db/schema";
import { createSelectSchema } from "drizzle-zod";

export const zodUserSchema = createSelectSchema(user, {
  email: (sc) =>
    sc.email
      .email("Invalid email")
      .trim()
      .min(1, "Email tidak boleh kosong")
      .max(255, "Email terlalu panjang"),
  password: (sc) =>
    sc.password
      .trim()
      .min(1, "Password tidak boleh kosong")
      .min(8, "Password minimal 8 Karakter")
      .max(255, "Password terlalu panjang"),
  username: (sc) =>
    sc.username
      .trim()
      .min(1, "Username tidak boleh kosong")
      .max(255, "Username terlalu panjang"),
});
