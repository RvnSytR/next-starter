import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { path, GetCurrentPage } from "@/components/menu";

import { NavHead } from "@/components/layout/nav-head";
import { NavMain } from "@/components/layout/nav-main";
// import { NavFooter } from "@/components/layout/nav-footer";
import { LayoutSkeleton } from "@/components/layout/section";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  //   SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: GetCurrentPage(path.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.role === "pending") return <LayoutSkeleton />;

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <NavHead {...session.user} />
        </SidebarHeader>

        <SidebarContent>
          <NavMain />
        </SidebarContent>

        {/* <SidebarFooter>
        <NavFooter user={data.user} />
      </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
}
