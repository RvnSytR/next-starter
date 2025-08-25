"use client";

import { getActiveRoute } from "@/lib/utils";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ComponentProps, useEffect, useState } from "react";
import { Collapsible } from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuButtonProps,
  useSidebar,
} from "../ui/sidebar";

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

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
