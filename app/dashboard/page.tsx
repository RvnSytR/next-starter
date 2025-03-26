import {
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage, path } from "@/lib/menu";
import { getSession } from "@/server/auth-action";

export default async function Page() {
  const data = await getSession();

  return (
    <Section currentPage={GetCurrentPage(path.protected)}>
      <div className="space-y-1">
        <SectionTitle text="Section Title" />
        <span className="text-sm">Section Description</span>
      </div>

      <SectionLabel className="text-left">
        <p>{JSON.stringify(data, null, 2)}</p>
      </SectionLabel>
    </Section>
  );
}
