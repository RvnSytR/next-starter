import { Section } from "@/components/layout/section";
import {
  ActiveSessionButton,
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeAllOtherSessionButton,
  VerifiedUserBadge,
} from "@/components/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardPage } from "@/lib/content";
import { getTitle } from "@/lib/utils";
import { checkAndGetAuthorizedSession, getListSession } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/profile") };

export default async function Page() {
  const { session, currenRoute } =
    await checkAndGetAuthorizedSession("/dashboard/profile");

  const sessionList = await getListSession();
  const { info, password, activeSession, deleteAccount } =
    dashboardPage.profile;

  return (
    <Section currentPage={currenRoute.displayName} className="items-center">
      <Card
        id="personal-information"
        className="w-full scroll-m-20 lg:max-w-2xl"
      >
        <CardHeader className="flex-row" action>
          <div className="space-y-1.5">
            <CardTitle>{info.title}</CardTitle>
            <CardDescription>{info.desc}</CardDescription>
          </div>

          {!session.user.emailVerified && (
            <VerifiedUserBadge className="size-fit" />
          )}
        </CardHeader>

        <Separator />

        <PersonalInformation {...session.user} />
      </Card>

      <Card id="change-password" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>{password.title}</CardTitle>
          <CardDescription>{password.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <ChangePasswordForm />
      </Card>

      <Card id="active-session" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>{activeSession.title}</CardTitle>
          <CardDescription>{activeSession.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-y-2">
          {sessionList.map((item, index) => (
            <ActiveSessionButton
              key={index}
              currentSessionId={session.session.id}
              {...item}
            />
          ))}
        </CardContent>

        <Separator />

        <CardFooter>
          <RevokeAllOtherSessionButton />
        </CardFooter>
      </Card>

      <Card id="delete-account" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="text-destructive">
            {deleteAccount.title}
          </CardTitle>
          <CardDescription>{deleteAccount.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <DeleteMyAccountButton {...session.user} />
        </CardContent>
      </Card>
    </Section>
  );
}
