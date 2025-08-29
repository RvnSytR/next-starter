import { Tagline } from "@/components/layout/section";
import { SidebarApp } from "@/components/layout/sidebar-app";
import { getTitle } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard") };

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <SidebarApp>
      {children}

      <footer className="bg-background/90 z-10 mt-auto flex h-12 items-center justify-center border-t text-center">
        <Tagline className="container" />
      </footer>
    </SidebarApp>
  );
}
