"use client";

import { dashboardRoute, Route } from "@/lib/const";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ComponentProps, useEffect, useState } from "react";
import { Collapsible } from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuButtonProps,
  useSidebar,
} from "../ui/sidebar";

function IsActiveRoute(route: Route): boolean {
  const pathname = usePathname();

  const trimProtectedRoute = (p: string) =>
    p.replace(dashboardRoute, "").trim();

  const trimmedCurrentRoute = trimProtectedRoute(pathname);
  const trimmedRoute = trimProtectedRoute(route);

  const isRootRoute = pathname === dashboardRoute && pathname === route;
  const isTrimmedRoute =
    !!trimmedRoute && trimmedCurrentRoute.startsWith(trimmedRoute);

  return isRootRoute || isTrimmedRoute;
}

// ? SC = Sidebar Client
export function SCMenuButton({
  route,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  route: Route;
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={IsActiveRoute(route)}
      {...props}
    />
  );
}

export function SCCollapsible({
  route,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root> & {
  route: Route;
}) {
  const isActive = IsActiveRoute(route);
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
