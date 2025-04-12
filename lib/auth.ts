import { db } from "@/server/db/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { adminRoles } from "./role";

export const auth = betterAuth({
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

export type Session = {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};
