import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "./route";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  subMenu?: { subLabel: string; className?: string }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "General",
    content: [
      { route: "dashboard", icon: LayoutDashboard },
      { route: "account", icon: UsersRound },
    ],
  },
  {
    section: "Settings",
    content: [
      {
        route: "profile",
        icon: UserRound,
        subMenu: [
          { subLabel: "Personal Information" },
          { subLabel: "Change Password" },
          { subLabel: "Active Session" },
          {
            subLabel: "Delete Account",
            className: "text-destructive hover:text-destructive",
          },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (Omit<MenuContent, "route" | "subMenu"> & {
  path: string;
  displayName: string;
})[] = [
  { path: "/", displayName: "Home", icon: ExternalLink },
  { path: "/somewhere", displayName: "Help", icon: CircleHelp },
];
