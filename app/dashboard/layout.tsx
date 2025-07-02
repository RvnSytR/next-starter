import { SidebarApp } from "@/components/layout/sidebar-app";
import { getTitle } from "@/lib/utils";
import { getSession } from "@/server/action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTagline } from "../../components/layout/section";

export const metadata: Metadata = { title: getTitle("dashboard") };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) notFound();
  return (
    <SidebarApp {...session.user}>
      {children}
      <div className="bg-background/90 z-10 mt-auto flex h-12 items-center justify-center border-t text-center">
        <SectionTagline className="container" />
      </div>
    </SidebarApp>
  );
}
