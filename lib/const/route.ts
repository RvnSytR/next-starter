import { Role } from "../permission";

export type Route = "signIn" | "dashboard" | "account" | "profile";

export const route = {
  signIn: "/sign-in",
  protected: "/dashboard",
};

export const routeMetadata: Record<
  Route,
  { path: string; displayName: string; role?: "all" | Role[] }
> = {
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
    path: `${route.protected}/profile`,
    displayName: "My Profile",
    role: "all",
  },

  account: {
    path: `${route.protected}/account`,
    displayName: "Users",
    role: ["admin"],
  },
};
