import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SectionSkeleton } from "@/components/layout/section-dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) return <SectionSkeleton />;

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      {children}
    </SidebarProvider>
  );
}
