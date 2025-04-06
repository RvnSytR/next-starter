"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession(head?: Headers) {
  return await auth.api.getSession({ headers: head ?? (await headers()) });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}
