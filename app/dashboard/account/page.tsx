import { Section } from "@/components/layout/section";
import {
  AdminAccountDataTable,
  AdminCreateUserDialog,
} from "@/components/modules/auth";
import { dashboardPage } from "@/lib/content";
import { getTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getUserList } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("account") };

export default async function Page() {
  const { session, currenRoute } =
    await checkAndGetAuthorizedSession("account");
  const data = await getUserList();

  return (
    <Section currentPage={currenRoute.displayName} className="xl:items-center">
      <AdminAccountDataTable
        data={data.users}
        currentUserId={session.user.id}
        withRefresh
        {...dashboardPage.account}
      >
        <AdminCreateUserDialog />
      </AdminAccountDataTable>
    </Section>
  );
}
