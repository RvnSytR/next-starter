import type { Role } from "@/server/db/schema";
import {
  type LucideIcon,
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";
import { label, page } from "./content";

type MenuProps = { section: string; body: MenuBody[] };
type MenuRole = Exclude<Role, "pending"> | "all";
type SubMenuProps = { subLabel: string; elementId: string }[];

type MenuBody = {
  href: string;
  label: string;
  role: MenuRole[];
  icon?: LucideIcon;
  isDisable?: boolean;
  subMenu?: SubMenuProps;
};

const path = {
  login: "/login",
  protected: "/dashboard",
  account: "/dashboard/account",
};

const menu: MenuProps[] = [
  {
    section: "General",
    body: [
      {
        href: path.protected,
        label: "Dashboard",
        role: ["all"],
        icon: LayoutDashboard,
      },
      {
        href: path.account,
        label: "User Management",
        role: ["all"],
        icon: UserRound,
      },
    ],
  },
  {
    section: "Lainnya",
    body: [
      {
        href: `${path.protected}/settings`,
        label: "Settings",
        role: ["all"],
        icon: Settings,
        subMenu: [
          { subLabel: "Change Profile", elementId: "changeProfile" },
          { subLabel: "Change Password", elementId: "changePassword" },
        ],
      },
    ],
  },
];

const secondaryMenu: MenuBody[] = [
  { href: "/", label: "Homepage", role: ["all"], icon: ExternalLink },
  { href: "/somewhere", label: "Help", role: ["all"], icon: CircleHelp },
];

function GetMenu(
  path: string,
  withoutIcon?: boolean,
): MenuBody | Omit<MenuBody, "icon"> | null {
  const allMenu = Object.values(menu).flatMap((item) => item.body);

  const result = allMenu
    .map((item) => {
      if (withoutIcon) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { icon, ...rest } = item;
        return rest;
      }
      return item;
    })
    .filter((item) => item.href === path);

  return result[0] ?? null;
}

function GetMenuByRole(role: MenuRole) {
  return menu
    .map((section) => {
      const filteredBody = section.body.filter(
        (item) => item.role.includes(role) || item.role.includes("all"),
      );

      if (filteredBody.length) {
        return { section: section.section, body: filteredBody } as MenuProps;
      } else return null;
    })
    .filter((section) => section !== null);
}

function GetCurrentPage(path: string, metadata?: boolean) {
  const currentPage = GetMenu(path)?.label;
  if (!currentPage) return label.error.protectedPath;
  return metadata ? page.metadata(currentPage) : currentPage;
}

export { GetCurrentPage, GetMenu, GetMenuByRole, path, secondaryMenu };
