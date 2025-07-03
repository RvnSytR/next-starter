import { Section } from "@/components/layout/section";
import { R } from "@/components/other-ui/r";
import { checkAndGetAuthorizedSession } from "@/server/action";

export default async function Page() {
  const { routeMeta } = await checkAndGetAuthorizedSession("/dashboard");

  return (
    <Section
      currentPage={routeMeta.displayName}
      className="items-center justify-center"
    >
      <R />
      <p className="animate-fade-up delay-500">Next Starter v2.5</p>
    </Section>
  );
}
