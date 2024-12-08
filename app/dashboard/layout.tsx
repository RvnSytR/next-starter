import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CustomLoader } from "@/components/global/icon";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      {children}
    </SidebarProvider>
  );
}
