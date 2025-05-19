import { Section } from "@/components/layout/section";
import { checkRouteAccess } from "@/server/auth-action";

export default async function Page() {
  const { session, menu } = await checkRouteAccess("/dashboard");

  return (
    <Section currentPage={menu.displayName}>
      <p>{JSON.stringify(session, null, 2)}</p>
    </Section>
  );
}
