import { Section } from "@/components/layout/section";
import { R } from "@/components/other-ui/r";
import { checkAndGetAuthorizedSession } from "@/server/action";

export default async function Page() {
  const { session, routeMeta } =
    await checkAndGetAuthorizedSession("/dashboard");

  return (
    <Section
      currentPage={routeMeta.displayName}
      className="items-center justify-center"
    >
      <R />
      <p>{JSON.stringify(session, null, 2)}</p>
    </Section>
  );
}
