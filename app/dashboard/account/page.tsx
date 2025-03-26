import { Section } from "@/components/layout/section";
import { GetCurrentPage } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: GetCurrentPage("/account", true, true),
};

export default async function Page() {
  const res = "Hello World";

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
    <Section currentPage={GetCurrentPage("/account", false, true)}>
      {/* <UserDataTable
        data={data}
        currentIdUser={session.user.id_user}
        facetedFilter={facetedFilter}
      /> */}

      <p>{JSON.stringify(res, null, 2)}</p>
    </Section>
  );
}
