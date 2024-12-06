// import type { Role } from "@/lib/db/schema";
// import { type LucideIcon, LayoutDashboard } from "lucide-react";

// #region // * Content Management
const currentYear = new Date().getFullYear();
const PATH = {
  login: "/login",
  protected: "/dashboard",
};
const LABEL = {
  copyright: `Copyright © ${currentYear}. Project Title. All rights reserved.`,
  login: "Login Berhasil!",
  logout: "Logout Berhasil!",
  loading: {
    default: "Mohon Tunggu Sebentar...",
    revalidating: "Revalidating...",
    login: "Logging in...",
    logout: "Logging out...",
  },
  button: {
    login: "Login",
  },
  error: {
    fileSize: "Ukuran Gambar Terlalu Besar!",
    validateRoute: "Route Invalid!",
  },
};
// #endregion

// #region // * Menu
// type Menu = {
//   section: string;
//   body: MenuBody[];
// };

// type MenuBody = {
//   href: string;
//   label: string;
//   role?: Exclude<Role, "pending">;
//   icon?: LucideIcon;
//   isDisable?: boolean;
// };

// const MENU: Menu[] = [
//   {
//     section: "Dashboard",
//     body: [
//       {
//         href: "/dashboard",
//         label: "Dashboard",
//         // role: "admin",
//         icon: LayoutDashboard,
//       },
//     ],
//   },
// ];

// const GetMenu = (path: string): MenuBody | null => {
//   const allMenu = Object.values(MENU).flat();
//   const result = allMenu
//     .flatMap((item) => item.body)
//     .filter((item) => item.href === path);
//   return result.length ? result[0] : null;
// };

// #endregion

// export type { Menu };
// export { GetMenu, PATH, LABEL, MENU };
export { PATH, LABEL };
