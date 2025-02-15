"use client";

import { usePathname } from "next/navigation";
import { path } from "../menu";

import {
  SidebarMenuButton,
  SidebarMenuButtonProps,
  useSidebar,
} from "../ui/sidebar";

export function ClientSidebarMenuButton({
  pathname,
  children,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  pathname: string;
}) {
  const currentPath = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const trimProtectedPath = (p: string) => p.replace(path.protected, "").trim();

  const trimmedCurrentPath = trimProtectedPath(currentPath);
  const trimmedPath = trimProtectedPath(pathname);

  const isRootPath = currentPath === path.protected && currentPath === pathname;
  const isTrimmedPath =
    !!trimmedPath && trimmedCurrentPath.startsWith(trimmedPath);

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={isRootPath || isTrimmedPath}
      {...props}
    >
      {children}
    </SidebarMenuButton>
  );
}
