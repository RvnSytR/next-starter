import { AppSidebar } from "@/components/layout/app-sidebar";
import { GetCurrentPage, path } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: GetCurrentPage(path.protected, true),
};

export default async function DashboardLayout({
  children,
}: Readonly<React.ComponentProps<"div">>) {
  return (
    <AppSidebar role={role} {...userProps}>
      {children}
    </AppSidebar>
  );
}
