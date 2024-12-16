import { auth } from "@/lib/auth";
import { Sidebar, SidebarSkeleton } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.role === "pending") return <SidebarSkeleton />;
  const { username, email, role } = session.user;
  return (
    <Sidebar data={{ username: username, email: email, role: role }}>
      {children}
    </Sidebar>
  );
}
