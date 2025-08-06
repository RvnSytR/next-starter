import { DashboardMain } from "@/components/layout/section";
import { R } from "@/components/other/motion";
import { checkAndGetAuthorizedSession } from "@/server/action";

export default async function Page() {
  const { session, routeMeta } =
    await checkAndGetAuthorizedSession("/dashboard");

  return (
    <DashboardMain
      currentPage={routeMeta.displayName}
      className="items-center justify-center"
    >
      <R />
      <p className="animate-fade delay-500">
        {JSON.stringify(session, null, 2)}
      </p>
    </DashboardMain>
  );
}
