import { Section } from "@/components/layout/section";
import { checkAndGetAuthorizedSession } from "@/server/action";

export default async function Page() {
  const { session, currenRoute } =
    await checkAndGetAuthorizedSession("dashboard");

  return (
    <Section currentPage={currenRoute.displayName}>
      <p>{JSON.stringify(session, null, 2)}</p>
    </Section>
  );
}
