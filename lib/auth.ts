import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugins } from "better-auth/plugins";
import { appInfo } from "./const";
import { adminRoles, roles } from "./permission";

export const auth = betterAuth({
  appName: appInfo.name,
  user: { deleteUser: { enabled: true } },
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies(), adminPlugins({ roles, adminRoles })],
});

export type Session = typeof auth.$Infer.Session;
