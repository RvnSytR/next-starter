import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { page } from "@/lib/content";
import { path } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { CustomButton } from "../custom/custom-button";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../custom/dynamic-breadcrumb";
import { ThemeToggle } from "../custom/theme";
import { Separator } from "../ui/separator";

export function Section({
  children,
  ...props
}: DynamicBreadcrumbProps & { children?: React.ReactNode }) {
  return (
    <SidebarInset className="gap-y-4 p-4">
      <header className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb {...props} />
          </div>

          <ThemeToggle />
        </div>

        <Separator />
      </header>

      {children}

      <footer className="mt-auto grid gap-y-4 text-center">
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
