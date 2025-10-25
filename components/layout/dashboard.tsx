"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ThemeButton } from "../ui/buttons-client";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { Separator } from "../ui/separator";

export function DashboardMain({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  const isFullWidth = true;

  return (
    <>
      <nav className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-4 border-b p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb {...props} />
        </div>

        <div className="flex items-center gap-x-2">
          {JSON.stringify(isFullWidth)}
          <ThemeButton />
        </div>
      </nav>

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col gap-y-4 py-4",
          isFullWidth ? "px-4" : "container",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
