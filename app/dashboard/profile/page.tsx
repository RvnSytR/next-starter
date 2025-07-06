import { Section } from "@/components/layout/section";
import {
  ActiveSessionButton,
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeOtherSessionsButton,
  UserRoleBadge,
  UserVerifiedBadge,
} from "@/components/modules/auth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardPage } from "@/lib/content";
import { Role } from "@/lib/permission";
import { getTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getListSession } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/profile") };

export default async function Page() {
  const {
    session: { session, user },
    routeMeta,
  } = await checkAndGetAuthorizedSession("/dashboard/profile");

  const sessionList = await getListSession();
  const { info, password, activeSession, deleteAccount } =
    dashboardPage.profile;

  return (
    <Section currentPage={routeMeta.displayName} className="items-center">
      <Card
        id="personal-information"
        className="w-full scroll-m-20 lg:max-w-xl"
      >
        <CardHeader className="flex-row">
          <CardTitle>{info.title}</CardTitle>
          <CardDescription>{info.desc}</CardDescription>
          <CardAction className="flex flex-col items-end gap-1.5 md:flex-row">
            {user.emailVerified && (
              <UserVerifiedBadge className="order-1 md:order-2" />
            )}

            <UserRoleBadge
              role={user.role as Role}
              className="order-2 md:order-1"
            />
          </CardAction>
        </CardHeader>

        <Separator />

        <PersonalInformation {...user} />
      </Card>

      <Card id="change-password" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader>
          <CardTitle>{password.title}</CardTitle>
          <CardDescription>{password.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <ChangePasswordForm />
      </Card>

      <Card id="active-session" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader>
          <CardTitle>{activeSession.title}</CardTitle>
          <CardDescription>{activeSession.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-y-2">
          {sessionList.map((item, index) => (
            <ActiveSessionButton
              key={index}
              currentSessionId={session.id}
              {...item}
            />
          ))}
        </CardContent>

        <Separator />

        <CardFooter>
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="delete-account" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader>
          <CardTitle className="text-destructive">
            {deleteAccount.title}
          </CardTitle>
          <CardDescription>{deleteAccount.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <DeleteMyAccountButton {...user} />
        </CardContent>
      </Card>
    </Section>
  );
}
