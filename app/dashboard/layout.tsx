import { redirect } from "next/navigation";
import { ValidateSession } from "@/server/action";
import { PATH } from "@/components/content";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await ValidateSession();
  if (!session) redirect(PATH.login);
  return children;
}
