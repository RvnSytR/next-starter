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
  subMenu?: { label: string; className?: string }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "General",
    content: [
      { route: "/dashboard", icon: LayoutDashboard },
      { route: "/dashboard/account", icon: UsersRound },
    ],
  },
  {
    section: "Settings",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRound,
        subMenu: [
          { label: "Personal Information" },
          { label: "Change Password" },
          { label: "Active Session" },
          {
            label: "Delete Account",
            className: "text-destructive hover:text-destructive",
          },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (Omit<MenuContent, "route" | "subMenu"> & {
  url: string;
  displayName: string;
})[] = [
  { url: "/", displayName: "Home", icon: ExternalLink },
  { url: "/somewhere", displayName: "Help", icon: CircleHelp, disabled: true },
];
