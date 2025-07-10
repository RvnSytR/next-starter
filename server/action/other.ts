"use server";

import { redirect, RedirectType } from "next/navigation";

export async function redirectAction(path: string, type?: RedirectType) {
  redirect(path, type);
}
