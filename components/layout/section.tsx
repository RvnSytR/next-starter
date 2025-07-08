import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { CopyButton } from "../custom/custom-button";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../other/dynamic-breadcrumb";
import { ThemeToggle } from "../other/theme";
import { Label } from "../ui/label";
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
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb {...props} />
        </div>

        <div className="flex items-center gap-x-2">
          <ThemeToggle />
        </div>
      </header>

      <div
        className={cn(
          "relative z-10 container flex flex-1 flex-col gap-y-4 py-4",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

export function SectionTagline({ className }: { className?: string }) {
  return (
    <small className={cn("text-muted-foreground", className)}>
      {"Built by "}
      <Link href="https://github.com/RvnSytR" className="link">
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}

export function SectionSheetDetails({
  data,
}: {
  data: { label: string; content: string; withCopy?: boolean }[];
}) {
  return data.map(({ label, content, withCopy }, index) => (
    <div key={index} className="grid gap-y-1">
      <Label>{label}</Label>

      {withCopy ? (
        <div className="flex items-center gap-x-2">
          <small className="text-muted-foreground">{content}</small>
          <CopyButton value={content} size="iconxs" variant="ghost" />
        </div>
      ) : (
        <small className="text-muted-foreground">{content}</small>
      )}
    </div>
  ));
}
