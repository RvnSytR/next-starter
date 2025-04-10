import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

// Any role that isn't in the adminRoles list, even if they have the permission, will not be considered an admin.
// https://www.better-auth.com/docs/plugins/admin#admin-roles
const adminRoles = ["admin"] as const;
type AdminRoles = (typeof adminRoles)[number];

const userRoles = ["user"] as const;
type UserRoles = (typeof userRoles)[number];

const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies(), admin({ adminRoles: [...adminRoles] })],
  user: { deleteUser: { enabled: true } },
});

type Session = {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};

export { adminRoles, auth, userRoles };
export type { AdminRoles, Session, UserRoles };
