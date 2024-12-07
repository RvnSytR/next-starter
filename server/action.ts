"use server";

import { revalidatePath } from "next/cache";
import { redirect, type RedirectType } from "next/navigation";

export async function ClientRedirect(url: string, type?: RedirectType) {
  redirect(url, type);
}

export async function ClientRevalidatePath(
  originalPath: string,
  type?: "layout" | "page",
) {
  revalidatePath(originalPath, type);
}
