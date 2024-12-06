"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect, type RedirectType } from "next/navigation";

import { auth } from "@/lib/auth";
import { state } from "@/lib/db/state";
import { GetMenu, LABEL } from "@/components/content";
import { Role } from "@/lib/db/schema";

export async function ValidateSession() {
  const session = await auth();
  if (!session) return null;
  const { id_user, username, email, role } = session.user;
  const [res] = await state.user.getById.execute({ id_user: id_user });
  return res.username === username && res.email === email && res.role === role
    ? session
    : null;
}

export async function ValidateRoute(route: string, role?: Role) {
  const menu = GetMenu(route);
  if (!menu) throw Error(LABEL.error.validateRoute);
  if (menu.role) {
    const userRole = role ?? (await auth())?.user.role;
    if (!(menu.role === userRole)) notFound();
  }
}

export async function ClientRedirect(url: string, type?: RedirectType) {
  redirect(url, type);
}

export async function ClientRevalidatePath(
  originalPath: string,
  type?: "layout" | "page",
) {
  revalidatePath(originalPath, type);
}
