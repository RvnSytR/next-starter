"use client";

import { cn } from "@/lib/utils";
import { useLayout } from "@/providers/layout";
import { Activity } from "react";
import { Spinner } from "../ui/spinner";

export function DashboardMainContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isFullWidth, isMounted } = useLayout();

  return (
    <>
      <Activity mode={!isMounted ? "visible" : "hidden"}>
        <div className="flex flex-1 items-center justify-center p-4">
          <Spinner variant="frame" className="size-5" />
        </div>
      </Activity>

      <Activity mode={isMounted ? "visible" : "hidden"}>
        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col gap-y-4 py-4",
            isFullWidth ? "px-4" : "container",
            className,
          )}
        >
          {children}
        </div>
      </Activity>
    </>
  );
}
