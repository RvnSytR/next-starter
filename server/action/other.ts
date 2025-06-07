"use server";

import { redirect } from "next/navigation";

export async function redirectAction(url: string) {
  redirect(url);
}
