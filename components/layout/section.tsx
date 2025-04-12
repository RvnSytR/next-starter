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
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <DynamicBreadcrumb {...props} />
        </div>

        <ThemeToggle />
      </header>

      <main className={cn("z-20 my-4 flex flex-col gap-y-4 px-4", className)}>
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
}: {
  code?: number;
  message?: string;
  href?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex grow flex-col items-center justify-center gap-y-6 md:gap-y-2",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-x-4 md:flex-row">
        <h1 className="animate-fade-right text-9xl">{code}</h1>
        <h1 className="animate-fade-left text-center leading-tight whitespace-pre-line lg:text-start">
          {message}
        </h1>
      </div>

      <Button
        size="lg"
        variant="ghost"
        className="hover:border-primary animate-fade-up h-12 rounded-full border-4 font-semibold"
        asChild
      >
        <Link href={href}>
          <LinkLoader defaultIcon={buttonIcon} />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
