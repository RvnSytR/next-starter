import { Section } from "@/components/layout/section";
import { getCurrentPage } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/settings", true, true),
};

export default async function Page() {
  return (
    <Section currentPage={getCurrentPage("/settings", false, true)}>
      <p>Profile Thing</p>
    </Section>
  );
}
