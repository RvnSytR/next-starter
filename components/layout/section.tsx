import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { route } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { LinkLoader } from "../custom/custom-button";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../other/dynamic-breadcrumb";
import { ThemeToggle } from "../other/theme";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function Section({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  return (
    <SidebarInset>
      <header className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-2 border-b p-4 shadow-xs backdrop-blur-sm">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <DynamicBreadcrumb {...props} />
        </div>

        <ThemeToggle />
      </header>

      <main className={cn("my-4 flex flex-col gap-y-4 px-4", className)}>
        {children}
      </main>
    </SidebarInset>
  );
}

export function SectionLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex size-full flex-col items-center justify-center text-center",
        className,
      )}
      {...props}
    />
  );
}

export function SectionNotFound({
  ...props
}: Omit<DynamicBreadcrumbProps, "currentPage">) {
  return (
    <Section currentPage="Not Found!" {...props}>
      <SectionLabel>
        <span className="text-9xl font-bold">404</span>
        <p>Page Not Found</p>

        <Button variant="outline" className="mt-4 rounded-full" asChild>
          <Link href={route.protected}>
            <LinkLoader defaultIcon={<LayoutDashboard />} />
            Go To Main Page
          </Link>
        </Button>
      </SectionLabel>
    </Section>
  );
}
