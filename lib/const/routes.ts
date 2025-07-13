import { Role } from "../permission";

export type RouteRole = "all" | Role[];
export type RouteMeta = { displayName: string; role?: RouteRole };

const createRoutes = <T extends Record<string, RouteMeta>>(routes: T) => routes;

export const routesMeta = createRoutes({
  "/sign-in": { displayName: "Sign In" },
  "/dashboard": { displayName: "Dashboard", role: "all" },
  "/dashboard/profile": { displayName: "My Profile", role: "all" },
  "/dashboard/users": { displayName: "Users", role: ["admin"] },
});

export type Route = keyof typeof routesMeta;

export const allRoutes = Object.keys(routesMeta) as Route[];
export const signInRoute: Route = "/sign-in";
export const dashboardRoute: Route = "/dashboard";
