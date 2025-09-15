"use server";

import { Role } from "@/lib/permission";
import { routesMeta } from "@/lib/routes";
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

export async function requireAuth(route: Route) {
  const meta = routesMeta[route];
  if (!meta.role) notFound();

  const session = await getSession();
  if (!session) notFound();

  const isAuthorized =
    meta.role &&
    (meta.role === "all" || meta.role.includes(session.user.role as Role));

  if (!isAuthorized) notFound();

  return { session, meta };
}
