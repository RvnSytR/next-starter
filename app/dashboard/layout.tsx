import { SidebarApp } from "@/components/layout/sidebar-app";
import { GridPattern } from "@/components/other-ui/grid-pattern";
import { SidebarInset } from "@/components/ui/sidebar";
import { setTitle } from "@/lib/utils";
import { getSession } from "@/server/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: setTitle("dashboard") };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) return notFound();
  return (
    <SidebarApp {...session.user}>
      <SidebarInset>
        <GridPattern className="stroke-accent/35 z-0" />
        {children}
      </SidebarInset>
    </SidebarApp>
  );
}
