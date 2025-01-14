import {
  Section,
  SectionGroup,
  SectionLabel,
  SectionTitle,
} from "@/components/layout/section";
import { path, GetCurrentPage } from "@/components/menu";

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <SectionGroup className="grow">
        <div className="space-y-1">
          <SectionTitle>Section Title</SectionTitle>
          <p className="desc">Section Description</p>
        </div>

        <SectionLabel>Hello From Dashboard!</SectionLabel>
      </SectionGroup>
    </Section>
  );
}
