import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { role } from "@/server/db/schema";
import { state } from "@/server/db/state";

import { path, GetCurrentPage } from "@/components/menu";

import { Section, LayoutSkeleton } from "@/components/layout/section";
import { AccountDataTable } from "@/components/modules/auth";

export const metadata: Metadata = {
  title: GetCurrentPage(path.account, true),
};

export default async function Page() {
  const session = await auth();
  if (!session) return <LayoutSkeleton />;

  const data = await state.user.select.all.execute();
  const facetedFilter = [
    {
      id: "role",
      arr: role.map((r) => {
        return {
          value: r,
          length: data.filter((item) => item.role === r).length,
        };
      }),
    },
  ];

  return (
    <Section currentPage={GetCurrentPage(path.account)}>
      <AccountDataTable
        data={data}
        currentIdUser={session.user.id_user}
        facetedFilter={facetedFilter}
      />
    </Section>
  );
}
