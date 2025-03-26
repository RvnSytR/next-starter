import {
  type LucideIcon,
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";
import type { AdminRoles, UserRoles } from "./auth";
import { label, page } from "./content";

type MenuRole = UserRoles | AdminRoles | "all";
type MenuProps = { section: string; body: MenuBody[] };
type SubMenuProps = { subLabel: string; elementId: string }[];

type MenuBody = {
  href: string;
  label: string;
  role: MenuRole[];
  icon?: LucideIcon;
  isDisable?: boolean;
  subMenu?: SubMenuProps;
};

const path = { auth: "/auth", protected: "/dashboard" };

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
        href: `${path.protected}/account`,
        label: "User Management",
        role: ["admin"],
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
  withoutIcon: boolean = false,
): MenuBody | Omit<MenuBody, "icon"> | null {
  const [result] = Object.values(menu)
    .flatMap((item) => item.body)
    .map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { icon, ...rest } = item;
      if (withoutIcon) return rest;
      else return item;
    })
    .filter((item) => item.href === path);
  return result ?? null;
}

function GetMenuByRole(role: string): MenuProps[] {
  return menu
    .map(({ section, body }) => {
      const filteredBody = body.filter(
        (item) =>
          item.role.includes(role as MenuRole) || item.role.includes("all"),
      );

      if (filteredBody.length > 0) return { section, body: filteredBody };
      else return null;
    })
    .filter((section) => section !== null);
}

function GetCurrentPage(
  currentPath: string,
  metadata: boolean = false,
  isProtected: boolean = false,
) {
  const currentPage = GetMenu(
    isProtected ? `${path.protected}${currentPath}` : currentPath,
  )?.label;
  if (!currentPage) return label.error.protectedPath;
  return metadata ? page.metadata(currentPage) : currentPage;
}

export { GetCurrentPage, GetMenu, GetMenuByRole, path, secondaryMenu };
