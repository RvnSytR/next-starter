import {
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage, path } from "@/lib/menu";

export default async function Page() {
  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <div className="space-y-1">
        <SectionTitle text="Section Title" />
        <span className="text-sm">Section Description</span>
      </div>

      <SectionLabel>Hello From Dashboard!</SectionLabel>
    </Section>
  );
}
