import { SidebarApp } from "@/components/layouts/sidebar-app";
import { getSession } from "@/server/action";
import { getTitle } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SWRConfig } from "swr";

export const metadata: Metadata = { title: getTitle("/dashboard") };

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getSession();
  if (!session) notFound();
  return (
    <SWRConfig value={{ fallback: { session } }}>
      <SidebarApp data={session.user}>{children}</SidebarApp>
    </SWRConfig>
  );
}
