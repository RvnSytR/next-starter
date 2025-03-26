import { Section } from "@/components/layout/section";
import { env } from "@/lib/env";
import { getCurrentPage } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/account", true, true),
};

export default async function Page() {
  const res = env.MYSQL_HOST;

  // const facetedFilter = [
  //   {
  //     id: "role",
  //     arr: [...userRoles, ...adminRoles].map((r) => {
  //       return {
  //         value: r,
  //         length: users.filter((item) => item === r).length,
  //       };
  //     }),
  //   },
  // ];

  return (
    <Section currentPage={getCurrentPage("/account", false, true)}>
      {/* <UserDataTable
        data={data}
        currentIdUser={session.user.id_user}
        facetedFilter={facetedFilter}
      /> */}

      <p>{JSON.stringify(res, null, 2)}</p>
    </Section>
  );
}
