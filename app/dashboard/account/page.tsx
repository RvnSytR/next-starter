import { Section } from "@/components/layout/section";
import {
  AdminAccountDataTable,
  AdminCreateUserDialog,
} from "@/components/modules/auth";
import { page } from "@/lib/content";
import { getCurrentPage, setProtectedRoute } from "@/lib/menu";
import { checkRouteAccess, getUserList } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage(setProtectedRoute("/account"), true),
};

export default async function Page() {
  const { session, menu } = await checkRouteAccess(
    setProtectedRoute("/account"),
  );

  const data = await getUserList();

  return (
    <Section currentPage={menu.displayName} className="items-center">
      <AdminAccountDataTable
        currentUser={session.user}
        data={data.users}
        className="w-full lg:max-w-7xl"
        withRefresh
        {...page.account}
      >
        <AdminCreateUserDialog />
      </AdminAccountDataTable>
    </Section>
  );
}
