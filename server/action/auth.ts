"use server";

import { auth } from "@/lib/auth";
import { Route, routesMeta } from "@/lib/const";
import { Role } from "@/lib/permission";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { deleteFile, getFileKeyFromPublicUrl } from "../s3";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getListSession() {
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

export async function checkAndGetAuthorizedSession(route: Route) {
  const routeMeta = routesMeta[route];
  if (!routeMeta.role) notFound();

  const session = await getSession();
  if (!session) notFound();

  const routeRole = routeMeta.role;
  const userRole = session.user.role as Role;
  const isAuthorized = routeRole === "all" || routeRole.includes(userRole);

  if (!isAuthorized) notFound();
  return { session, routeMeta };
}
