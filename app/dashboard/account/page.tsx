import { LayoutSkeleton, Section } from "@/components/layout/section";
import { UserDataTable } from "@/components/modules/auth";
import { auth } from "@/lib/auth";
import { GetCurrentPage, path } from "@/lib/menu";
import { role } from "@/server/db/schema";
import { state } from "@/server/db/state";
import { Metadata } from "next";

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
      <UserDataTable
        data={data}
        currentIdUser={session.user.id_user}
        facetedFilter={facetedFilter}
      />
    </Section>
  );
}
