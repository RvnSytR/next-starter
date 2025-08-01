import { Role } from "../permission";

export type RouteRole = "all" | Role[];
export type RouteMeta = { displayName: string; role?: RouteRole };

const createRoutes = <T extends Record<string, RouteMeta>>(routes: T) => routes;

export const routesMeta = createRoutes({
  "/sign-in": { displayName: "Masuk" },
  "/dashboard": { displayName: "Ringkasan", role: "all" },
  "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
});

export type Route = keyof typeof routesMeta;

export const allRoutes = Object.keys(routesMeta) as Route[];
export const signInRoute: Route = "/sign-in";
export const dashboardRoute: Route = "/dashboard";
