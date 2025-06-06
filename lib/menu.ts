import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { appInfo } from "./const";
import { adminRoles, Role, userRoles } from "./permission";

type MenuRole = Role | "all";
type MenuProps = { section: string; body: MenuBody[] };
type MenuWithoutIconProps = Omit<MenuBody, "icon">;
type MenuBody = {
  href: string;
  displayName: string;
  role: MenuRole[];
  icon?: LucideIcon;
  disabled?: boolean;
  subMenu?: { subLabel: string; className?: string }[];
};

const route = {
  signIn: "/sign-in",
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
        displayName: "Dashboard",
        role: ["all"],
        icon: LayoutDashboard,
      },
      {
        href: setProtectedRoute("/account"),
        displayName: "User Management",
        role: adminRoles,
        icon: UsersRound,
      },
    ],
  },
  {
    section: "Settings",
    body: [
      {
        href: setProtectedRoute("/profile"),
        displayName: "My Profile",
        role: ["all"],
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

const footerSidebarMenu: Omit<MenuBody, "role" | "subMenu">[] = [
  { href: "/", displayName: "Home", icon: ExternalLink },
  { href: "/somewhere", displayName: "Help", icon: CircleHelp },
];

// #region // * Get Menu
function setProtectedRoute(r: string) {
  return route.protected === "/" ? r : `${route.protected}${r}`;
}

function getMenu(
  route: string,
  withIcon: boolean = false,
): MenuBody | MenuWithoutIconProps | null {
  const [menuBody] = Object.values(sidebarMenu)
    .flatMap(({ body }) => body)
    .filter(({ href }) => route === href);

  if (!menuBody) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...restMenu } = menuBody;
  return withIcon ? menuBody : restMenu;
}

function getMenuByRole(role: string): MenuProps[] {
  return sidebarMenu
    .map(({ section, body }) => {
      const filteredBody = body.filter(
        ({ role: menuRole }) =>
          menuRole.includes(role as MenuRole) || menuRole.includes("all"),
      );

      if (filteredBody.length > 0) return { section, body: filteredBody };
      else return null;
    })
    .filter((section) => section !== null);
}

function getCurrentPage(currentRoute: string, metadata: boolean = false) {
  const currentPage = getMenu(currentRoute)?.displayName;
  if (!currentPage) return "Invalid route!";
  return metadata ? ` | ${appInfo.name}` : currentPage;
}
// #endregion

export {
  footerSidebarMenu,
  getCurrentPage,
  getMenu,
  getMenuByRole,
  route,
  setProtectedRoute,
};
export type { MenuRole, MenuWithoutIconProps };
