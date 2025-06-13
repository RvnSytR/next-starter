"use client";

import { route } from "@/lib/const";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ComponentProps, useEffect, useState } from "react";
import { Collapsible } from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuButtonProps,
  useSidebar,
} from "../ui/sidebar";

function IsActiveRoute(pathname: string): boolean {
  const currentPathname = usePathname();

  const trimProtectedRoute = (p: string) =>
    p.replace(route.protected, "").trim();

  const trimmedCurrentRoute = trimProtectedRoute(currentPathname);
  const trimmedRoute = trimProtectedRoute(pathname);

  const isRootRoute =
    currentPathname === route.protected && currentPathname === pathname;
  const isTrimmedRoute =
    !!trimmedRoute && trimmedCurrentRoute.startsWith(trimmedRoute);

  return isRootRoute || isTrimmedRoute;
}

// ? SC = Sidebar Client
export function SCMenuButton({
  pathname,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  pathname: string;
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={IsActiveRoute(pathname)}
      {...props}
    />
  );
}

export function SCCollapsible({
  pathname,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root> & {
  pathname: string;
}) {
  const isActive = IsActiveRoute(pathname);
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
