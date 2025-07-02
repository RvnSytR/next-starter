"use server";

import { auth } from "@/lib/auth";
import { Route, RouteRole, routesMetadata } from "@/lib/const";
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
  const currenRoute = routesMetadata[route];
  if (!("role" in currenRoute)) return notFound();

  const session = await getSession();
  if (!session?.user.role) notFound();

  const routeRole = currenRoute.role as RouteRole;
  const userRole = session.user.role as Role;
  if (!(routeRole === "all" || routeRole.includes(userRole))) notFound();

  return { session, currenRoute };
}
