import { Section, SectionError } from "@/components/layout/section";
import {
  AdminAccountDataTable,
  AdminCreateUserDialog,
} from "@/components/modules/auth";
import { page } from "@/lib/content";
import { getCurrentPage } from "@/lib/menu";
import { getSession, getUserList } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/account", true, true),
};

export default async function Page() {
  const session = await getSession();
  if (!session?.user.role) return <SectionError />;

  const data = await getUserList();

  return (
    <Section
      currentPage={getCurrentPage("/account", false, true)}
      className="items-center"
    >
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
