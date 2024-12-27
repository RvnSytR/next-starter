import { Fragment, ReactNode } from "react";

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
import { Hash, SidebarIcon } from "lucide-react";
import { SheetTrigger } from "../ui/sheet";

export function Section({
  skeleton,
  children,
  ...props
}: {
  skeleton?: boolean;
  children: ReactNode;
} & DynamicBreadcrumbProps) {
  return (
    <Fragment>
      <header className="flex flex-col gap-y-3">
        <div className="flex items-center">
          <div className="over flex grow items-center gap-x-2">
            <span className="hidden text-sm text-muted-foreground lg:flex">
              /
            </span>

            <SheetTrigger className="flex lg:hidden" asChild>
              <Button size="iconsm" variant="ghost" disabled={skeleton}>
                <SidebarIcon />
              </Button>
            </SheetTrigger>
            <Separator
              orientation="vertical"
              className="mr-2 flex h-4 lg:hidden"
            />

            <DynamicBreadcrumb {...props} />
          </div>

          <ThemeToggle disabled={skeleton} />
        </div>

        <Separator />
      </header>

      {children}

      <footer className="mt-auto flex flex-col items-center gap-4 text-center">
        <Separator />
        <small className="desc">{label.copyright}</small>
      </footer>
    </Fragment>
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

export function SectionNotFound({
  ...props
}: Omit<DynamicBreadcrumbProps, "currentPage">) {
  return (
    <Section currentPage="Not Found!" {...props}>
      Hello world
    </Section>
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

      <Section currentPage="..." skeleton>
        <CustomLoader className="m-auto" />
      </Section>
    </main>
  );
}
