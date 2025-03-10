/* eslint-disable @typescript-eslint/no-empty-object-type */
import { path } from "@/lib/menu";
import type { UserCredentials } from "@/server/db/schema";
import NextAuth, { DefaultSession, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { state } from "../server/db/state";

// * Module Augmentation
declare module "next-auth" {
  interface User extends UserCredentials {}

  interface Session {
    user: DefaultSession["user"] & UserCredentials;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserCredentials {}
}

// * Config
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 2592000 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials?.email) throw new Error("Email is required");
        const [res] = await state.user.select.byEmail.execute({
          email: credentials.email as string,
        });
        if (!res) throw new Error("User does not exist!");
        return { ...res };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await state.user.update.log.execute({ id_user: user.id_user });
      return true;
    },

    jwt({ token, user }): JWT | null {
      if (user) {
        const { id_user, username, email, role, last_signin_at, created_at } =
          user;
        token.id_user = id_user;
        token.username = username;
        token.email = email;
        token.role = role;
        token.last_signin_at = last_signin_at;
        token.created_at = created_at;
      }
      return token;
    },

    session({ session, token }): Session | DefaultSession {
      if (token && token.email) {
        const { id_user, username, email, role, last_signin_at, created_at } =
          token;
        session.user.id_user = id_user;
        session.user.username = username;
        session.user.email = email;
        session.user.role = role;
        session.user.last_signin_at = last_signin_at;
        session.user.created_at = created_at;
      }
      return session;
    },
  },
  pages: { signIn: path.signIn },
});
