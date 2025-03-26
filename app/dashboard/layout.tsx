import { AppSidebar } from "@/components/layout/sidebar-app";
import { userRoles } from "@/lib/auth";
import { GetCurrentPage, path } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: GetCurrentPage(path.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<React.ComponentProps<"div">>) {
  const session = await getSession();
  if (!session) return notFound();
  const { role, ...rest } = session.user;

  return (
    <AppSidebar role={role ?? userRoles[0]} {...rest}>
      {children}
    </AppSidebar>
  );
}
