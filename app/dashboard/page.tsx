import { Section } from "@/components/layout/section";
import { route } from "@/lib/menu";
import { checkRouteAccess } from "@/server/auth-action";

export default async function Page() {
  const { session, menu } = await checkRouteAccess(route.protected);
  return (
    <Section currentPage={menu.displayName}>
      <p>{JSON.stringify(session, null, 2)}</p>
    </Section>
  );
}
