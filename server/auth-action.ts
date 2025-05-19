"use server";

import { auth } from "@/lib/auth";
import { getMenu, MenuRole, MenuWithoutIconProps } from "@/lib/menu";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { deleteFile, getFileKeyFromPublicUrl } from "./s3";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function getUserList() {
  return await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function deleteProfilePicture(image: string) {
  await deleteFile([await getFileKeyFromPublicUrl(image)]);
}

export async function checkRouteAccess(route: string) {
  const menu = getMenu(route) as MenuWithoutIconProps;
  if (!menu) return notFound();

  const session = await getSession();
  if (!session?.user.role) return notFound();

  const isAllowed =
    menu.role.includes("all") ||
    menu.role.includes(session.user.role as MenuRole);

  return isAllowed ? { session, menu } : notFound();
}
