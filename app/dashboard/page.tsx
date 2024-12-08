import { GetMenu, PATH } from "@/components/content";
import { Section, SectionHeader } from "@/components/layout/section";

export default function Page() {
  return (
    <Section>
      <SectionHeader currentPage={GetMenu(PATH.dashboard)!.label} />

      <p>Hello world</p>
    </Section>
  );
}
