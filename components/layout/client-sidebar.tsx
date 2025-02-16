"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { IsActivePath } from "@/lib/utils";

import {
  useSidebar,
  type SidebarMenuButtonProps,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Collapsible } from "../ui/collapsible";

export function ClientSidebarMenuButton({
  pathname,
  children,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  pathname: string;
}) {
  const currentPathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={IsActivePath(pathname, currentPathname)}
      {...props}
    >
      {children}
    </SidebarMenuButton>
  );
}

export function ClientSidebarCollapsible({
  pathname,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  pathname: string;
}) {
  const currentPathname = usePathname();
  const isActive = IsActivePath(pathname, currentPathname);
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props}>
      {children}
    </Collapsible>
  );
}
