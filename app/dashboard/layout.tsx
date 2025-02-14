import { Metadata } from "next";

import { path, GetCurrentPage } from "@/components/menu";

import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutSkeleton } from "@/components/layout/section";

import { SidebarProvider } from "@/components/ui/sidebar";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username, email, role } = session.user;

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
