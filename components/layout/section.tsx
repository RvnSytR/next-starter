import { Fragment, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { page } from "../content";
import { CustomLoader, iconSize } from "../icon";
import { ThemeToggle } from "../custom/theme";

import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../custom/dynamic-breadcrumb";
import { CustomButton } from "../custom/custom-button";
import { path } from "../menu";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LayoutDashboard, SidebarIcon } from "lucide-react";
import { SheetTrigger } from "../ui/sheet";

export function Section({
  skeleton,
  children,
  ...props
}: (
  | {
      skeleton?: false;
      children: ReactNode;
    }
  | {
      skeleton: true;
      children?: ReactNode;
    }
) &
  DynamicBreadcrumbProps) {
  return (
    <Fragment>
      <header className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-2">
          <div className="over flex grow items-center gap-x-2">
            <span className="hidden text-sm text-muted-foreground lg:flex">
              /
            </span>

            <SheetTrigger className="flex lg:hidden" asChild>
              <Button
                size="iconsm"
                variant="ghost"
                className="shrink-0"
                disabled={skeleton}
              >
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

      {skeleton ? (
        <CustomLoader size={iconSize.lg} className="m-auto" />
      ) : (
        children
      )}

      <footer className="mt-auto flex flex-col items-center gap-4 text-center">
        <Separator />
        <small className="leading-tight text-muted-foreground">
          {page.copyright}
        </small>
      </footer>
    </Fragment>
  );
}

export function SectionGroup({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-y-2", className)}>{children}</div>
  );
}

export function SectionTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <h4
      className={cn("line-clamp-2 flex items-center leading-tight", className)}
    >
      {text}
    </h4>
  );
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
        "flex size-full flex-col items-center justify-center text-center text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionNotFound({
  ...props
}: Omit<DynamicBreadcrumbProps, "currentPage">) {
  return (
    <Section currentPage="Not Found!" {...props}>
      <SectionLabel>
        <h1>404</h1>
        <p>Page Not Found</p>
        <CustomButton
          customType="nav"
          href={path.protected}
          variant="outline"
          className="mt-4 rounded-full"
          icon={<LayoutDashboard />}
          text="Go To Main Page"
        />
      </SectionLabel>
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
      <Section currentPage="..." skeleton />
    </main>
  );
}
