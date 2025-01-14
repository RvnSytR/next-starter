import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { role } from "@/lib/db/schema";
import { state } from "@/lib/db/state";

import { Section } from "@/components/layout/section";
import { AccountDataTable } from "@/components/layout/auth";
import { ColumnFacetedFilter } from "@/components/layout/data-table";
import { path, GetCurrentPage } from "@/components/menu";

export const metadata: Metadata = {
  title: GetCurrentPage(path.account, true),
};

export default async function Page() {
  const session = await auth();
  if (!session) return <Section currentPage="..." skeleton />;

  const data = await state.user.select.all.execute();
  const columnFacetedFilter: ColumnFacetedFilter[] = [
    { id: "role", arr: Array.from(role) as string[] },
  ];

  return (
    <Section currentPage={GetCurrentPage(path.account)}>
      <AccountDataTable
        data={data}
        currentIdUser={session.user.id_user}
        columnFacetedFilter={columnFacetedFilter}
      />
    </Section>
  );
}
