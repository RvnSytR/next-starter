import { DashboardMain } from "@/components/layout/section";
import { R } from "@/components/ui/motion";
import { requireAuthorizedSession } from "@/server/action";

export default async function Page() {
  const { session, meta } = await requireAuthorizedSession("/dashboard");

  return (
    <DashboardMain
      currentPage={meta.displayName}
      className="items-center justify-center"
    >
      <R />
      <p className="animate-fade delay-500">
        {JSON.stringify(session, null, 2)}
      </p>
    </DashboardMain>
  );
}
