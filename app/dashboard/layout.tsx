import { Tagline } from "@/components/layouts/sections";
import { SidebarApp } from "@/components/layouts/sidebar-app";
import { getTitle } from "@/lib/utils";
import { getSession } from "@/server/action";
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
      <SidebarApp data={session.user}>
        {children}
        <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12">
          <Tagline className="container" />
        </footer>
      </SidebarApp>
    </SWRConfig>
  );
}
