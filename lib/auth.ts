import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI } from "better-auth/plugins";
import { env } from "./env";

// Any role that isn't in the adminRoles list, even if they have the permission, will not be considered an admin.
// https://www.better-auth.com/docs/plugins/admin#admin-roles
const adminRoles = ["admin"] as const;
type AdminRoles = (typeof adminRoles)[number];

const userRoles = ["user"] as const;
type UserRoles = (typeof userRoles)[number];

const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies(), openAPI(), admin({ adminRoles: [...adminRoles] })],
});

type Session = typeof auth.$Infer.Session.session;
type User = typeof auth.$Infer.Session.user;

export { adminRoles, auth, userRoles };
export type { AdminRoles, Session, User, UserRoles };
