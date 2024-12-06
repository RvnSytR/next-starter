"use server";

import { signIn, signOut } from "@/lib/auth";

export async function SignInHandler(email: string, password: string) {
  await signIn("credentials", {
    email: email,
    password: password,
    redirect: false,
  });
}

export async function SignOutHandler() {
  await signOut({ redirect: false });
}
