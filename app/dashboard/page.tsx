import { Metadata } from "next";

import { Section } from "@/components/layout/section-dashboard";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/", true),
};

export default function Page() {
  return (
    <Section currentPage={GetCurrentPage("/")}>
      <p>Hello world</p>
    </Section>
  );
}
