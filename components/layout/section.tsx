import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
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

      <main className={cn("z-10 my-4 flex flex-col gap-y-4 px-4", className)}>
        {children}
      </main>
    </>
  );
}

export function SectionError({
  code = 404,
  message = "Oops, looks like\nthere's nobody here!",
  href = "/",
  buttonIcon = <Home />,
  buttonText = "Go To Main Page",
  className,
  children,
}: {
  code?: number;
  message?: string;
  href?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex grow flex-col items-center justify-center gap-y-6 md:gap-y-2",
        "mask-radial-from-75% mask-alpha",
        className,
      )}
    >
      <div className="z-50 flex flex-col items-center gap-x-4 text-shadow-sm md:flex-row">
        <h1 className="animate-fade-right text-9xl">{code}</h1>
        <h1 className="animate-fade-left text-center leading-tight whitespace-pre-line lg:text-start">
          {message}
        </h1>
      </div>

      <Button
        size="lg"
        variant="ghost"
        className="hover:border-primary animate-fade-up z-50 h-12 rounded-full border-4 font-semibold shadow-sm"
        asChild
      >
        <Link href={href}>
          <LinkLoader defaultIcon={buttonIcon} />
          {buttonText}
        </Link>
      </Button>

      {children}
    </div>
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
