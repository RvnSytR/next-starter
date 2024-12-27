import { Metadata } from "next";

import {
  Section,
  SectionDescription,
  SectionGroup,
  SectionHeader,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/dashboard", true),
};

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage("/dashboard")}>
      <SectionGroup>
        <SectionHeader>
          <SectionTitle withHash>Section Title</SectionTitle>
          <SectionDescription>Section Description</SectionDescription>
        </SectionHeader>

        <div className="h-screen">Hello world</div>
      </SectionGroup>
    </Section>
  );
}
