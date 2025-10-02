import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LoaderIcon, PackageX } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { ThemeButton } from "../ui/buttons-client";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export function DashboardMain({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  return (
    <>
      <nav className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-4 border-b p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb {...props} />
        </div>
        <ThemeButton size="icon-sm" />
      </nav>

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

export function Tagline({ className }: { className?: string }) {
  return (
    <small className={cn("text-muted-foreground", className)}>
      {"Built by "}
      <Link href="https://github.com/RvnSytR" className="link-underline">
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}

export function SheetDetails({
  data,
}: {
  data: { label: string; content: ReactNode; className?: string }[];
}) {
  return data.map(({ label, content, className }, index) => (
    <div key={index} className="grid gap-y-1">
      <Label>{label}</Label>
      <div className={cn("text-muted-foreground text-sm", className)}>
        {content}
      </div>
    </div>
  ));
}

export function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderIcon className="text-foreground size-4 animate-spin" />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideText = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideText?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-destructive/10 text-destructive flex flex-col items-center justify-center gap-2 rounded-md p-4 text-center text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        <PackageX className="size-4 shrink-0" /> {error?.code}
      </div>
      {!hideText && <p>{error?.message ?? "Tidak ada data"}</p>}
    </div>
  );
}
