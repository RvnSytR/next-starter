import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugins } from "better-auth/plugins";
import { appInfo } from "./const";
import { adminRoles, defaultRole, roles } from "./permission";

export const auth = betterAuth({
  appName: appInfo.name,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  plugins: [nextCookies(), adminPlugins({ roles, adminRoles })],
  user: {
    deleteUser: { enabled: true },
    additionalFields: {
      role: { type: "string", input: false, defaultValue: defaultRole },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
