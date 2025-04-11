import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { route } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { CustomButton } from "../custom/custom-button";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../other/dynamic-breadcrumb";
import { ThemeToggle } from "../other/theme";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export function Section({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  return (
    <SidebarInset className="h-dvh">
      <header className="flex items-center justify-between gap-x-2 border-b p-4 shadow-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <DynamicBreadcrumb {...props} />
        </div>

        <ThemeToggle />
      </header>

      <ScrollArea className="grow overflow-hidden px-4">
        <main className={cn("my-4 flex flex-col gap-y-4", className)}>
          {children}
        </main>
      </ScrollArea>
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

        <CustomButton
          href={route.protected}
          variant="outline"
          className="mt-4 rounded-full"
          icon={<LayoutDashboard />}
          text="Go To Main Page"
          onClickLoading
        />
      </SectionLabel>
    </Section>
  );
}
