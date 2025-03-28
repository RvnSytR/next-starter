import { Section, SectionLabel } from "@/components/layout/section";
import { getCurrentPage, path } from "@/lib/menu";
import { getSession } from "@/server/auth-action";

export default async function Page() {
  const data = await getSession();

  return (
    <Section currentPage={getCurrentPage(path.protected)}>
      <SectionLabel className="text-left">
        <p>{JSON.stringify(data, null, 2)}</p>
      </SectionLabel>
    </Section>
  );
}
