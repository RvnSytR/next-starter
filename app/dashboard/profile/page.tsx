import { Section } from "@/components/layout/section";
import {
  ActiveSessionButton,
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeOtherSessionsButton,
  UserRoleBadge,
  UserVerifiedBadge,
} from "@/components/modules/user";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pages } from "@/lib/content";
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

  const { info, password, activeSession, deleteAccount } = pages.profile;

  const sessionList = await getListSession();

  return (
    <Section currentPage={routeMeta.displayName} className="items-center">
      <Card
        id="personal-information"
        className="w-full scroll-m-20 lg:max-w-xl"
      >
        <CardHeader className="border-b">
          <CardTitle>{info.title}</CardTitle>
          <CardDescription>{info.desc}</CardDescription>
          <CardAction className="flex flex-col items-end gap-1.5 md:flex-row">
            {user.emailVerified && <UserVerifiedBadge />}
            <UserRoleBadge role={user.role as Role} />
          </CardAction>
        </CardHeader>

        <PersonalInformation {...user} />
      </Card>

      <Card id="change-password" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>{password.title}</CardTitle>
          <CardDescription>{password.desc}</CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>

      <Card id="active-session" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>{activeSession.title}</CardTitle>
          <CardDescription>{activeSession.desc}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-2">
          {sessionList.map((item, index) => (
            <ActiveSessionButton
              key={index}
              currentSessionId={session.id}
              {...item}
            />
          ))}
        </CardContent>

        <CardFooter className="border-t">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="delete-account" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">
            {deleteAccount.title}
          </CardTitle>
          <CardDescription>{deleteAccount.desc}</CardDescription>
        </CardHeader>

        <CardContent>
          <DeleteMyAccountButton {...user} />
        </CardContent>
      </Card>
    </Section>
  );
}
