import { DashboardMain } from "@/components/layout/section";
import { R } from "@/components/ui/motion";
import { requireAuth } from "@/server/action";

export default async function Page() {
  const { session, meta } = await requireAuth("/dashboard");

  return (
    <DashboardMain
      currentPage={meta.displayName}
      className="items-center justify-center"
    >
      <R />
      <pre className="animate-fade delay-500">
        {JSON.stringify(session, null, 2)}
      </pre>
    </DashboardMain>
  );
}
