import { GetCurrentPage } from "@/components/content";
import { Section, SectionHeader } from "@/components/layout/section-dashboard";

export default function Page() {
  return (
    <Section>
      <SectionHeader currentPage={GetCurrentPage("/")} />
      <p>Hello world</p>
    </Section>
  );
}
