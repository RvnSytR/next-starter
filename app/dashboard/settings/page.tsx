import { Section } from "@/components/layout/section";
import { GetCurrentPage } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: GetCurrentPage("/settings", true, true),
};

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage("/settings", false, true)}>
      <p>Profile Thing</p>
    </Section>
  );
}
