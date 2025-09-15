import { Tagline } from "@/components/layout/section";
import { SidebarApp } from "@/components/layout/sidebar-app";
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

        <footer className="bg-background/90 z-10 mt-auto flex h-12 items-center justify-center border-t text-center">
          <Tagline className="container" />
        </footer>
      </SidebarApp>
    </SWRConfig>
  );
}
