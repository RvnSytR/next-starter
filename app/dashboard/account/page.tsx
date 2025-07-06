import { Section } from "@/components/layout/section";
import {
  AdminAccountDataTable,
  AdminCreateUserDialog,
} from "@/components/modules/auth";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardPage } from "@/lib/content";
import { getTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getUserList } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/account") };

export default async function Page() {
  const { session, routeMeta } =
    await checkAndGetAuthorizedSession("/dashboard/account");
  const data = await getUserList();

  return (
    <Section currentPage={routeMeta.displayName} className="md:pt-6">
      <CardHeader className="px-0">
        <CardTitle>{dashboardPage.account.title}</CardTitle>
        <CardDescription>{dashboardPage.account.desc}</CardDescription>
        <CardAction>
          <AdminCreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <AdminAccountDataTable
        data={data.users}
        currentUserId={session.user.id}
      />
    </Section>
  );
}
