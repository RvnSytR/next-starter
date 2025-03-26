import { Section } from "@/components/layout/section";
import { getCurrentPage } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/profile", true, true),
};

export default async function Page() {
  const session = await getSession();
  if (!session) return;

  return (
    <Section currentPage={getCurrentPage("/profile", false, true)}>
      <p>{JSON.stringify(session, null, 2)}</p>
    </Section>
  );
}
