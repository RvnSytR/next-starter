import { userColumn } from "@/components/data-table/column";
import { DataTable } from "@/components/data-table/data-table";
import { Section } from "@/components/layout/section";
import { AdminCreateUserDialog } from "@/components/modules/auth";
import { page } from "@/lib/content";
import { getCurrentPage } from "@/lib/menu";
import { getUserList } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/account", true, true),
};

export default async function Page() {
  const data = await getUserList();

  return (
    <Section
      currentPage={getCurrentPage("/account", false, true)}
      className="items-center"
    >
      <DataTable
        data={data.users}
        columns={userColumn}
        className="w-full lg:max-w-7xl"
        withRefresh
        {...page.account}
      >
        <AdminCreateUserDialog />
      </DataTable>
    </Section>
  );
}
