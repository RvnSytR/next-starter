import {
  Section,
  SectionGroup,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage } from "@/components/content";

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage("/dashboard")}>
      <SectionGroup>
        <div className="space-y-1">
          <SectionTitle withHash>Section Title</SectionTitle>
          <p className="desc">Section Description</p>
        </div>

        <div>Hello From Dashboard!</div>
      </SectionGroup>
    </Section>
  );
}
