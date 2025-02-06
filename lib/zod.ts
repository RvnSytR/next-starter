import { z } from "zod";
import { role, user } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const zodUserSchema = createSelectSchema(user, {
  email: (sc) =>
    sc
      .email("Mohon masukkan Email yang valid")
      .trim()
      .min(1, "Email tidak boleh kosong")
      .max(255, "Email terlalu panjang"),
  password: (sc) =>
    sc
      .trim()
      .min(1, "Password tidak boleh kosong")
      .min(8, "Password minimal 8 Karakter")
      .max(255, "Password terlalu panjang"),
  username: (sc) =>
    sc
      .trim()
      .min(1, "Username tidak boleh kosong")
      .max(255, "Username terlalu panjang"),
  role: z.enum(role, { required_error: "Harap pilih Status Pengguna" }),
});
