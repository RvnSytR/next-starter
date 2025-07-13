"use server";

import { auth, Session } from "@/lib/auth";
import { Route, RouteRole, routesMeta } from "@/lib/const";
import { Role } from "@/lib/permission";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { deleteFile, getFileKeyFromPublicUrl } from "../s3";

export async function checkAndGetAuthorizedSession(route: Route) {
  const routeMeta = routesMeta[route];
  if (!("role" in routeMeta)) notFound();

  const session = await getSession();
  if (!session) notFound();

  const routeRole = routeMeta.role as RouteRole;
  const userRole = session.user.role as Role;
  const isAuthorized = routeRole === "all" || routeRole.includes(userRole);

  if (!isAuthorized) notFound();
  return { session, routeMeta };
}

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

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      return await auth.api.revokeUserSessions({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}

export async function deleteProfilePicture(image: string) {
  await deleteFile([await getFileKeyFromPublicUrl(image)]);
}

export async function deleteUsers(
  data: Pick<Session["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await deleteProfilePicture(image);
      return await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}
