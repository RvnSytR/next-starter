import { Route } from "next";
import { Role } from "./permission";

export type RouteRole = "all" | Role[];
export type RouteMeta = { displayName: string; role?: RouteRole };

const routesMeta: Record<Route, RouteMeta> = {
  "/": { displayName: "Beranda" },
  "/sign-in": { displayName: "Masuk" },
  "/dashboard": { displayName: "Overview", role: "all" },
  "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
};

export const getRoutesMeta = (key: Route) =>
  routesMeta[key as keyof typeof routesMeta];

export const allRoutes = Object.keys(routesMeta) as Route[];
export const signInRoute: Route = "/sign-in";
export const dashboardRoute: Route = "/dashboard";
