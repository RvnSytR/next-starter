import {
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/layout/section";
import { getSession } from "@/lib/auth";
import { GetCurrentPage, path } from "@/lib/menu";

export default async function Page() {
  const session = await getSession();

  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <div className="space-y-1">
        <SectionTitle text="Section Title" />
        <span className="text-sm">Section Description</span>
      </div>

      <SectionLabel className="text-left">
        <p>{JSON.stringify(session, null, 2)}</p>
      </SectionLabel>
    </Section>
  );
}
