import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";

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
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [admin({ adminRoles: [...adminRoles] })],
});

const getSession = async () =>
  await auth.api.getSession({ headers: await headers() });

type User = typeof auth.$Infer.Session.user;

export { adminRoles, auth, getSession, userRoles };
export type { AdminRoles, User, UserRoles };
