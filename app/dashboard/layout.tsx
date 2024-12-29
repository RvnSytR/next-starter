import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { LayoutSkeleton } from "@/components/layout/section";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/dashboard", true),
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.role === "pending") return <LayoutSkeleton />;
  const { username, email, role } = session.user;
  return (
    <Sidebar username={username} email={email} role={role}>
      {children}
    </Sidebar>
  );
}
