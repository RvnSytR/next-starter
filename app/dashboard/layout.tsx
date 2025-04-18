import { SidebarApp } from "@/components/layout/sidebar-app";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { SidebarInset } from "@/components/ui/sidebar";
import { getCurrentPage, route } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: getCurrentPage(route.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<React.ComponentProps<"div">>) {
  const session = await getSession();
  if (!session?.user.role) return notFound();
  const { role, ...rest } = session.user;
  return (
    <SidebarApp role={role} {...rest}>
      <SidebarInset>
        <GridPattern className="stroke-input/25 z-0" />
        {children}
      </SidebarInset>
    </SidebarApp>
  );
}
