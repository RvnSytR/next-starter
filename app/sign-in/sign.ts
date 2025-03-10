"use server";

import { signIn, signOut } from "@/lib/auth";

export async function SignIn(email: string, password: string) {
  await signIn("credentials", {
    email: email,
    password: password,
    redirect: false,
  });
}

export async function SignOut() {
  await signOut({ redirect: false });
}
