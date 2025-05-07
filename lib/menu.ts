import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { label, page } from "./content";
import { adminRoles, Role, userRoles } from "./permission";

type MenuRole = Role | "all";
type MenuProps = { section: string; body: MenuBody[] };
type MenuBody = {
  href: string;
  label: string;
  role: MenuRole[];
  icon?: LucideIcon;
  disabled?: boolean;
  subMenu?: {
    subLabel: string;
    elementId: string;
    className?: string;
  }[];
};

const route = {
  auth: "/auth",
  protected: "/dashboard", // change to "/" if all the routes is protected
  other: [
    { href: "/hiddenFromMenu-route-1", role: userRoles },
    { href: "/hiddenFromMenu-route-2", role: adminRoles },
  ] satisfies Pick<MenuBody, "href" | "role">[],
};

const sidebarMenu: MenuProps[] = [
  {
    section: "General",
    body: [
      {
        href: route.protected,
        label: "Dashboard",
        role: ["all"],
        icon: LayoutDashboard,
      },
      {
        href: setProtectedRoute("/account"),
        label: "User Management",
        role: [...adminRoles],
        icon: UsersRound,
      },
    ],
  },
  {
    section: "Settings",
    body: [
      {
        href: setProtectedRoute("/profile"),
        label: "My Profile",
        role: ["all"],
        icon: UserRound,
        subMenu: [
          {
            subLabel: "Personal Information",
            elementId: "personal-information",
          },
          { subLabel: "Change Password", elementId: "change-password" },
          { subLabel: "Active Session", elementId: "active-session" },
          {
            subLabel: "Delete Account",
            elementId: "delete-account",
            className: "text-destructive hover:text-destructive",
          },
        ],
      },
    ],
  },
];

const footerSidebarMenu: MenuBody[] = [
  { href: "/", label: "Home", role: ["all"], icon: ExternalLink },
  { href: "/somewhere", label: "Help", role: ["all"], icon: CircleHelp },
];

// #region // * Get Menu
function setProtectedRoute(r: string) {
  return route.protected === "/" ? r : `${route.protected}${r}`;
}

function getMenuBody(route: string): MenuBody | null {
  const [result] = Object.values(sidebarMenu)
    .flatMap((item) => item.body)
    .map((item) => item)
    .filter((item) => route.startsWith(item.href));
  return result ?? null;
}

function getMenu(route: string): Omit<MenuBody, "icon"> | null {
  const menuBody = getMenuBody(route);
  if (!menuBody) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...restMenu } = menuBody;
  return restMenu ?? null;
}

function getMenuIcon(route: string): LucideIcon | null {
  return getMenuBody(route)?.icon ?? null;
}

function getMenuByRole(role: string): MenuProps[] {
  return sidebarMenu
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

function getCurrentPage(
  currentRoute: string,
  metadata: boolean = false,
  isProtected: boolean = false,
) {
  const currentPage = getMenu(
    isProtected ? `${route.protected}${currentRoute}` : currentRoute,
  )?.label;
  if (!currentPage) return label.error.protectedPath;
  return metadata ? page.title(currentPage) : currentPage;
}
// #endregion

export {
  footerSidebarMenu,
  getCurrentPage,
  getMenu,
  getMenuByRole,
  getMenuIcon,
  route,
  setProtectedRoute,
};
export type { MenuRole };
