import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { label } from "../content";
import { CustomLoader, iconSize } from "../global/icon";
import { ThemeToggle } from "../global/theme-provider";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "./dynamic-breadcrumb";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { Hash, SidebarIcon } from "lucide-react";

export function Section({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & DynamicBreadcrumbProps) {
  return (
    <SidebarInset
      className={cn("flex w-screen flex-col gap-y-4 p-4", className)}
    >
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

export function SectionGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-y-2">{children}</div>;
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return <div className="space-y-1 md:space-y-0">{children}</div>;
}

export function SectionTitle({
  withHash,
  className,
  children,
}: {
  withHash?: boolean;
  className?: string;
  children: ReactNode;
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

export function SectionDescription({ children }: { children: ReactNode }) {
  return <p className="desc">{children}</p>;
}

export function SectionLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
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

export function LayoutSkeleton() {
  return (
    <main className="flex min-h-screen">
      <aside className="hidden basis-1/6 p-2 lg:flex">
        <div className="flex size-full flex-col items-center justify-between p-4">
          <div className="skeleton h-10 w-full" />
          <CustomLoader size={iconSize.lg} />
          <div className="skeleton h-10 w-full" />
        </div>
      </aside>

      <SectionSkeleton />
    </main>
  );
}

export function SectionSkeleton() {
  return (
    <div className="flex grow flex-col justify-between rounded-md bg-background p-4 shadow lg:m-2">
      <header className="space-y-2">
        <div className="flex items-center">
          <div className="flex grow items-center gap-x-2">
            <Button size="iconsm" variant="ghost" disabled>
              <SidebarIcon />
            </Button>

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
  );
}
