import { Fragment } from "react";

import { cn } from "@/lib/utils";

import { label } from "../content";
import { iconSize } from "../global/icon";
import { ThemeToggle } from "../global/theme-provider";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "./dynamic-breadcrumb";

import { SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Hash, Sidebar } from "lucide-react";

export function Section({
  children,
  ...props
}: {
  children: React.ReactNode;
} & DynamicBreadcrumbProps) {
  return (
    <Fragment>
      <header className="space-y-2">
        <div className="flex h-10 items-center">
          <div className="flex grow items-center gap-x-2">
            <SheetTrigger className="flex lg:hidden" asChild>
              <Button size="iconsm" variant="ghost">
                <Sidebar />
              </Button>
            </SheetTrigger>

            <Separator
              orientation="vertical"
              className="mr-2 flex h-4 lg:hidden"
            />

            <DynamicBreadcrumb {...props} />
          </div>

          <ThemeToggle />
        </div>

        <Separator />
      </header>

      <div className="flex grow flex-col gap-y-4">
        {children}

        <footer className="mt-auto flex flex-col items-center gap-y-4">
          <Separator />
          <small className="desc">{label.copyright}</small>
        </footer>
      </div>
    </Fragment>
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
