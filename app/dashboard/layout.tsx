import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutSkeleton } from "@/components/layout/section";
import { auth } from "@/lib/auth";
import { GetCurrentPage, path } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: GetCurrentPage(path.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<React.ComponentProps<"div">>) {
  const session = await auth();
  if (!session || session.user.role === "pending") return <LayoutSkeleton />;
  const { role, ...userProps } = session.user;

  return (
    <AppSidebar role={role} {...userProps}>
      {children}
    </AppSidebar>
  );
}
