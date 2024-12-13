import type { Role } from "@/lib/db/schema";
import { type LucideIcon, LayoutDashboard } from "lucide-react";

// #region // * Content Management
const currentYear = new Date().getFullYear();
const PATH = {
  login: "/login",
  protected: "/dashboard",
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
    protectedPath: "Protected Path Invalid!",
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
type MenuRole = Exclude<Role, "pending"> | "all";

type Menu = {
  section: string;
  body: MenuBody[];
};

type MenuBody = {
  href: string;
  label: string;
  role: MenuRole;
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
        role: "all",
        icon: LayoutDashboard,
      },
    ],
  },
];

function GetMenu(path: string): MenuBody | null {
  const allMenu = Object.values(MENU).flat();
  const result = allMenu
    .flatMap((item) => item.body)
    .filter((item) => item.href === path);
  return result[0] ?? null;
}

function GetMenuByRole(role: MenuRole) {
  return MENU.map((section) => {
    const filteredBody = section.body.filter(
      (item) => item.role === role || item.role === "all",
    );
    if (filteredBody.length) {
      return {
        section: section.section,
        body: filteredBody,
      } as Menu;
    } else return null;
  }).filter((section) => section !== null);
}

function GetCurrentPage(path: string) {
  return GetMenu(path)?.label ?? LABEL.error.protectedPath;
}

// #endregion

export type { Menu, MenuRole };
export { GetMenu, GetMenuByRole, GetCurrentPage, PATH, LABEL, MENU };
