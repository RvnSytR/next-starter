import { Role } from "../permission";

export type RouteRole = "all" | Role[];
type RouteMetadata = { displayName: string; role?: RouteRole };

const createRoutes = <T extends Record<string, RouteMetadata>>(r: T) => r;

export const routesMetadata = createRoutes({
  "/sign-in": { displayName: "Sign In" },
  "/dashboard": { displayName: "Dashboard", role: "all" },
  "/dashboard/profile": { displayName: "My Profile", role: "all" },
  "/dashboard/account": { displayName: "Users", role: ["admin"] },
});

export type Route = keyof typeof routesMetadata;

export const signInRoute: Route = "/sign-in";
export const dashboardRoute: Route = "/dashboard";
