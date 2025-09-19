import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "next";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  // if href is not defined, the Link href prop will be `route/toKebabCase(label)`
  subMenu?: { label: string; href?: string; className?: string }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "Umum",
    content: [
      { route: "/dashboard", icon: LayoutDashboard },
      { route: "/dashboard/users", icon: UsersRound },
    ],
  },
  {
    section: "Pengaturan",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRound,
        subMenu: [
          { label: "Informasi Pribadi" },
          { label: "Ubah Kata Sandi" },
          { label: "Sesi Aktif" },
          {
            label: "Hapus Akun",
            className: "text-destructive hover:text-destructive",
          },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (Omit<MenuContent, "route" | "subMenu"> & {
  url: Route;
  displayName: string;
})[] = [
  { url: "/", displayName: "Beranda", icon: ExternalLink },
  {
    url: "/sign-in",
    displayName: "Bantuan",
    icon: CircleHelp,
    disabled: true,
  },
];
