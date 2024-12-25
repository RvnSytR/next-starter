import type { Role } from "@/lib/db/schema";
import { type LucideIcon, LayoutDashboard } from "lucide-react";

// #region // * Content Management
const currentYear = new Date().getFullYear();
const path = {
  login: "/login",
  protected: "/dashboard",
};
const label = {
  metadata: (currentPage: string) => `Project Title | ${currentPage}`,
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
    fileRequired: (f: string) => `Mohon upload ${f}!`,
    fileUpload: "Terjadi kesalahan saat mengupload file!",
    protectedPath: "Protected Path Invalid!",
    breadcrumb: "Menu Path Invalid!",
    parsedNumber: "Parsed Number Invalid!",
  },
  button: {
    login: "Login",
    regis: "Logout",
    logout: "Logout",
    refresh: "Refresh",
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
    section: "General",
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

function GetMenu(
  path: string,
  withoutIcon?: boolean,
): MenuBody | Omit<MenuBody, "icon"> | null {
  const allMenu = Object.values(MENU).flatMap((item) => item.body);

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

function GetCurrentPage(path: string, metadata?: boolean) {
  const currentPage = GetMenu(path)?.label;
  if (!currentPage) return label.error.protectedPath;
  return metadata ? label.metadata(currentPage) : currentPage;
}
// #endregion

export type { MenuRole };
export { GetMenu, GetMenuByRole, GetCurrentPage, path, label };
