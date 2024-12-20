import { cn } from "@/lib/utils";

import { label } from "../content";
import { CustomLoader, iconSize } from "../global/icon";
import { ThemeToggle } from "../global/theme-provider";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "./dynamic-breadcrumb";

import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { Hash } from "lucide-react";

export function Section({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & DynamicBreadcrumbProps) {
  return (
    <SidebarInset className={cn("flex flex-col gap-y-4 p-4", className)}>
      <header className="flex flex-col gap-y-3">
        <div className="flex items-center">
          <div className="over flex grow items-center gap-x-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb {...props} />
          </div>

          <ThemeToggle />
        </div>

        <Separator />
      </header>

      {children}

      <footer className="mt-auto flex flex-col items-center gap-4">
        <Separator />
        <small className="desc">{label.copyright}</small>
      </footer>
    </SidebarInset>
  );
}

export function SectionTitle({
  withHash,
  className,
  children,
}: {
  withHash?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h5
      className={cn(
        "line-clamp-2 flex items-center gap-x-2 leading-tight",
        className,
      )}
    >
      {withHash && (
        <Hash size={iconSize.sm} className="flex-none text-muted-foreground" />
      )}
      {children}
    </h5>
  );
}

export function SectionLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-20 text-muted-foreground",
        className,
      )}
    >
      <p className="text-center text-sm font-normal">{children}</p>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <main className="flex min-h-screen">
      <aside className="hidden basis-1/6 p-2 lg:flex">
        <div className="flex size-full flex-col items-center justify-between p-4">
          <div className="skeleton h-10 w-full" />
          <CustomLoader size={iconSize.lg} />
          <div className="skeleton h-10 w-full" />
        </div>
      </aside>

      <div className="flex grow flex-col justify-between rounded-md p-4 shadow lg:m-2 lg:border">
        <header className="space-y-2">
          <div className="flex items-center">
            <div className="flex grow items-center gap-x-2">
              <SidebarTrigger disabled />

              <Separator
                orientation="vertical"
                className="mr-2 flex h-4 lg:hidden"
              />

              <div className="skeleton h-4 w-full md:w-24" />
            </div>

            <ThemeToggle disabled />
          </div>

          <Separator />
        </header>

        <CustomLoader size={iconSize.lg} className="m-auto" />

        <footer className="space-y-4">
          <Separator />
          <div className="skeleton h-4 w-full" />
        </footer>
      </div>
    </main>
  );
}
