import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "../routes";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  subMenu?: { label: string; className?: string }[];
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
  url: string;
  displayName: string;
})[] = [
  { url: "/", displayName: "Beranda", icon: ExternalLink },
  {
    url: "/somewhere",
    displayName: "Bantuan",
    icon: CircleHelp,
    disabled: true,
  },
];
