"use server";

import { Role } from "@/lib/permission";
import { RouteRole, routesMeta } from "@/lib/routes";
import { Route } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSession } from "./user";

export async function getCustomHeaders() {
  const req = await headers();
  const url = req.get("x-url");
  const origin = req.get("x-origin");
  const pathname = req.get("x-pathname");
  return { url, origin, pathname };
}

export async function requireAuthorizedSession(route: Route) {
  const meta = routesMeta[route];
  if (!("role" in meta)) notFound();

  const session = await getSession();
  if (!session) notFound();

  const routeRole = meta.role as RouteRole;
  const userRole = session.user.role as Role;
  const isAuthorized = routeRole === "all" || routeRole.includes(userRole);

  if (!isAuthorized) notFound();

  return { session, meta };
}
