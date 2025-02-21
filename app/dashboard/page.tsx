import {
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage, path } from "@/components/menu";

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <div className="space-y-1">
        <SectionTitle text="Section Title" />
        <p className="desc">Section Description</p>
      </div>

      <SectionLabel>Hello From Dashboard!</SectionLabel>
    </Section>
  );
}
