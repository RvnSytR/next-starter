import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../other/dynamic-breadcrumb";
import { ThemeToggle } from "../other/theme";
import { Separator } from "../ui/separator";

export function Section({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  return (
    <>
      <header className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-2 border-b p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger className="hidden md:flex" />
          <Separator
            orientation="vertical"
            className="mr-2 hidden h-4 md:flex"
          />
          <DynamicBreadcrumb {...props} />
        </div>

        <div className="flex items-center gap-x-2">
          <ThemeToggle />
          <Separator orientation="vertical" className="flex h-4 md:hidden" />
          <SidebarTrigger className="flex md:hidden" />
        </div>
      </header>

      <main className={cn("z-10 flex flex-1 flex-col gap-y-4 p-4", className)}>
        {children}
      </main>
    </>
  );
}

export function SectionTagline() {
  return (
    <small className="text-muted-foreground">
      {"Built by "}
      <Link href="https://github.com/RvnSytR" className="link">
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}
