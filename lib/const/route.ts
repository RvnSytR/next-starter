import { Role } from "../permission";
import { setProtectedSubRoute } from "../utils";

export type Route = "signIn" | "dashboard" | "account" | "profile";
export type RouteMetadata = {
  path: string;
  displayName: string;
  role?: "all" | Role[];
};

export const route = {
  signIn: "/sign-in",
  protected: "/dashboard", // change to "/" if all the routes is protected
};

export const routeMetadata: Record<Route, RouteMetadata> = {
  signIn: {
    path: route.signIn,
    displayName: "Sign In",
  },

  dashboard: {
    path: route.protected,
    displayName: "Dashboard",
    role: "all",
  },

  profile: {
    path: setProtectedSubRoute("profile"),
    displayName: "My Profile",
    role: "all",
  },

  account: {
    path: setProtectedSubRoute("account"),
    displayName: "Users",
    role: ["admin"],
  },
};
