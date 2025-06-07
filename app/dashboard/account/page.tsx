import { Section } from "@/components/layout/section";
import {
  AdminAccountDataTable,
  AdminCreateUserDialog,
} from "@/components/modules/auth";
import { dashboardPage } from "@/lib/content";
import { setTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getUserList } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: setTitle("account") };

export default async function Page() {
  const { session, currenRoute } =
    await checkAndGetAuthorizedSession("account");
  const data = await getUserList();

  return (
    <Section currentPage={currenRoute.displayName} className="items-center">
      <AdminAccountDataTable
        currentUser={session.user}
        data={data.users}
        withRefresh
        {...dashboardPage.account}
      >
        <AdminCreateUserDialog />
      </AdminAccountDataTable>
    </Section>
  );
}
