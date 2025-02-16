import { cn } from "@/lib/utils";
import { page } from "../content";
import { path } from "../menu";
import { CustomLoader, iconSize } from "../icon";

import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../custom/dynamic-breadcrumb";
import { CustomButton } from "../custom/custom-button";
import { ThemeToggle } from "../custom/theme";

import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { LayoutDashboard } from "lucide-react";

export function Section({
  children,
  ...props
}: DynamicBreadcrumbProps & { children?: React.ReactNode }) {
  return (
    <SidebarInset className="gap-y-4 p-2 px-4">
      <header className="flex flex-col gap-y-2">
        <div className="flex h-12 shrink-0 items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb {...props} />
          </div>

          <ThemeToggle />
        </div>

        <Separator />
      </header>

      {children}

      <footer className="mt-auto flex h-12 flex-col items-center gap-y-4 text-center">
        <Separator />
        <small className="text-muted-foreground leading-tight">
          {page.copyright}
        </small>
      </footer>
    </SidebarInset>
  );
}

export function SectionTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <h4 className={cn("line-clamp-2", className)}>{text}</h4>;
}

export function SectionLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex size-full flex-col items-center justify-center text-center",
        className,
      )}
      {...props}
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
          customType="link"
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
    <SidebarInset>
      <ThemeToggle className="m-4" />

      <SectionLabel>
        <CustomLoader size={iconSize.lg} />
      </SectionLabel>
    </SidebarInset>
  );
}
