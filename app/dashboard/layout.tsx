import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarSkeleton } from "@/components/layout/section";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.role === "pending") return <SidebarSkeleton />;

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      {children}
    </SidebarProvider>
  );
}
