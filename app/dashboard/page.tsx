import { Metadata } from "next";

import {
  Section,
  SectionGroup,
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
        <div className="space-y-1">
          <SectionTitle withHash>Section Title</SectionTitle>
          <p className="desc">Section Description</p>
        </div>

        <div className="h-screen">Hello world</div>
      </SectionGroup>
    </Section>
  );
}
