import {
  Section,
  SectionGroup,
  SectionTitle,
} from "@/components/layout/section";
import { path } from "@/components/content";
import { GetCurrentPage } from "@/components/menu";

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <SectionGroup>
        <div className="space-y-1">
          <SectionTitle>Section Title</SectionTitle>
          <p className="desc">Section Description</p>
        </div>

        <div>Hello From Dashboard!</div>
      </SectionGroup>
    </Section>
  );
}
