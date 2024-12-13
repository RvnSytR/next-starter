import { Metadata } from "next";

import { Section } from "@/components/layout/section-dashboard";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/dashboard", true),
};

export default function Page() {
  return (
    <Section currentPage={GetCurrentPage("/dashboard")}>
      <p>Hello world</p>
    </Section>
  );
}
