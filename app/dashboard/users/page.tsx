import { Section } from "@/components/layout/section";
import {
  AdminCreateUserDialog,
  UserDataTable,
} from "@/components/modules/auth";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pages } from "@/lib/content";
import { getTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getUserList } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/users") };

export default async function Page() {
  const { session, routeMeta } =
    await checkAndGetAuthorizedSession("/dashboard/users");

  const { title, desc, placeholder } = pages.users;
  const data = await getUserList();

  return (
    <Section currentPage={routeMeta.displayName} className="pt-6">
      <CardHeader className="px-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
        <CardAction>
          <AdminCreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <UserDataTable
        data={data.users}
        currentUserId={session.user.id}
        searchPlaceholder={placeholder}
      />
    </Section>
  );
}
