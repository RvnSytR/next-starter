import type { Role } from "@/lib/db/schema";
import { type LucideIcon, LayoutDashboard, User2 } from "lucide-react";

// #region // * Content Management
const currentYear = new Date().getFullYear();
const PATH = {
  login: "/login",
  dashboard: "/dashboard",
};
const LABEL = {
  copyright: `Copyright © ${currentYear}. Project Title. All rights reserved.`,
  success: {
    login: "Login Berhasil!",
    logout: "Logout Berhasil!",
  },
  loading: {
    default: "Mohon Tunggu Sebentar...",
    refresh: "Refreshing...",
    login: "Logging in...",
    logout: "Logging out...",
  },
  error: {
    login: {
      notFound: "Akun tidak terdaftar!",
      emailOrPassword: "Email atau Password Salah!",
      pending:
        "Akun Anda masih dalam antrian persetujuan. Harap tunggu konfirmasi dari admin.",
    },
    regis: "Email sudah terdaftar!",
    fileSize: "Ukuran Gambar Terlalu Besar!",
    breadcrumb: "Menu Path Invalid!",
  },
  button: {
    login: "Login",
    logout: "Logout",
  },
  connection: {
    success: "Database connected!",
    error: "Database connection failed!",
  },
};
// #endregion

// #region // * Menu
type Menu = {
  section: string;
  body: MenuBody[];
};

type MenuBody = {
  href: string;
  label: string;
  role?: Exclude<Role, "pending">;
  icon?: LucideIcon;
  isDisable?: boolean;
};

const MENU: Menu[] = [
  {
    section: "Dashboard",
    body: [
      {
        href: "/dashboard",
        label: "Dashboard",
        // role: "admin",
        icon: LayoutDashboard,
      },
      {
        href: "/account",
        label: "Pengguna",
        // role: "admin",
        icon: User2,
      },
    ],
  },
];

const GetMenu = (path: string): MenuBody | null => {
  const allMenu = Object.values(MENU).flat();
  const result = allMenu
    .flatMap((item) => item.body)
    .filter((item) => item.href === path);
  return result[0] ?? null;
};

// #endregion

export type { Menu };
export { GetMenu, PATH, LABEL, MENU };
