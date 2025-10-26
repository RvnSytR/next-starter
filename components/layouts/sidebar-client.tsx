"use client";

import { getActiveRoute } from "@/utils";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ComponentProps, useEffect, useEffectEvent, useState } from "react";
import { Collapsible } from "../ui/collapsible";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { SidebarMenuButtonProps } from "./sidebar-app";

// ? SC = Sidebar Client

export function SCMenuButton({
  route,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  route: Route;
}) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={route === getActiveRoute(pathname)}
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
  const pathname = usePathname();
  const isActive = route === getActiveRoute(pathname);
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => setIsOpen(true));
  useEffect(() => {
    if (isActive) onActiveRoute();
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
