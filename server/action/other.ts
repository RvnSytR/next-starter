"use server";

import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function redirectAction(path: string, type?: RedirectType) {
  redirect(path, type);
}

export async function getCustomHeaders() {
  const req = await headers();
  const url = req.get("x-url");
  const origin = req.get("x-origin");
  const pathname = req.get("x-pathname");

  return { url, origin, pathname };
}
