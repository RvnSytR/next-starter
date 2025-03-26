import { SidebarApp } from "@/components/layout/sidebar-app";
import { getCurrentPage, path } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: getCurrentPage(path.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<React.ComponentProps<"div">>) {
  const session = await getSession();
  if (!session?.user?.role) return notFound();
  const { role, ...rest } = session.user;
  return (
    <SidebarApp role={role} {...rest}>
      {children}
    </SidebarApp>
  );
}
