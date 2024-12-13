import { GetMenu, PATH } from "@/components/content";
import { Section, SectionHeader } from "@/components/layout/section-dashboard";

export default function Page() {
  return (
    <Section>
      <SectionHeader currentPage={GetMenu(PATH.protected)!.label} />

      <p>Hello world</p>
    </Section>
  );
}
