import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugins } from "better-auth/plugins";
import { appMeta } from "./meta";
import { adminRoles, defaultRole, roles } from "./permission";

export const auth = betterAuth({
  appName: appMeta.name,
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
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

export type SessionWithUser = typeof auth.$Infer.Session;
