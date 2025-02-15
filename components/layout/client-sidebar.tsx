"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { path } from "../menu";

import {
  useSidebar,
  type SidebarMenuButtonProps,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Collapsible } from "../ui/collapsible";

function SetIsActive(pathname: string): boolean {
  const currentPathname = usePathname();

  const trimProtectedPath = (p: string) => p.replace(path.protected, "").trim();

  const trimmedCurrentPath = trimProtectedPath(currentPathname);
  const trimmedPath = trimProtectedPath(pathname);

  const isRootPath =
    currentPathname === path.protected && currentPathname === pathname;
  const isTrimmedPath =
    !!trimmedPath && trimmedCurrentPath.startsWith(trimmedPath);

  return isRootPath || isTrimmedPath;
}

export function ClientSidebarMenuButton({
  pathname,
  children,
  ...props
}: Omit<SidebarMenuButtonProps, "onClick" | "isActive"> & {
  pathname: string;
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      onClick={() => isMobile && toggleSidebar()}
      isActive={SetIsActive(pathname)}
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
  const isActive = SetIsActive(pathname);
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
