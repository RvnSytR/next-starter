import { Metadata } from "next";
import { state } from "@/lib/db/state";
import { auth } from "@/lib/auth";

import { path } from "@/components/content";
import { GetCurrentPage } from "@/components/menu";
import { Section } from "@/components/layout/section";
import { AccountDataTable } from "@/components/layout/data-table";

export const metadata: Metadata = {
  title: GetCurrentPage(path.createAccount, true),
};

export default async function Page() {
  const session = await auth();
  if (!session) return <Section currentPage="..." skeleton />;

  const data = await state.user.selectAll.execute();

  return (
    <Section currentPage={GetCurrentPage(path.createAccount)}>
      <AccountDataTable data={data} currentIdUser={session.user.id_user} />
    </Section>
  );
}
