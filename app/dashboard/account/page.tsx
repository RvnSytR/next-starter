import { Metadata } from "next";
import { state } from "@/lib/db/state";
import { auth } from "@/lib/auth";

import { Section } from "@/components/layout/section";
import { AccountDataTable } from "@/components/layout/auth";
import { path, GetCurrentPage } from "@/components/menu";

export const metadata: Metadata = {
  title: GetCurrentPage(path.account, true),
};

export default async function Page() {
  const session = await auth();
  if (!session) return <Section currentPage="..." skeleton />;

  const data = await state.user.selectAll.execute();

  return (
    <Section currentPage={GetCurrentPage(path.account)}>
      <AccountDataTable data={data} currentIdUser={session.user.id_user} />
    </Section>
  );
}
