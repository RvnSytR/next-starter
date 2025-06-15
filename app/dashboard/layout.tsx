import { SidebarApp } from "@/components/layout/sidebar-app";
import { GridPattern } from "@/components/other-ui/grid-pattern";
import { SidebarInset } from "@/components/ui/sidebar";
import { setTitle } from "@/lib/utils";
import { getSession } from "@/server/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTagline } from "../../components/layout/section";

export const metadata: Metadata = { title: setTitle("dashboard") };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) notFound();
  return (
    <SidebarApp {...session.user}>
      <SidebarInset>
        <GridPattern className="stroke-accent/35 z-0" />
        {children}
        <div className="bg-background z-10 mt-auto flex h-12 flex-col items-center justify-center border-t text-center">
          <SectionTagline className="container" />
        </div>
      </SidebarInset>
    </SidebarApp>
  );
}
