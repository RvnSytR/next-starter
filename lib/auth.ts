import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
});
