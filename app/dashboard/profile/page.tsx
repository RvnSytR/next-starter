import { Section } from "@/components/layout/section";
import {
  ActiveSessionButton,
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeAllOtherSessionButton,
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
import { getCurrentPage, setProtectedRoute } from "@/lib/menu";
import { checkRouteAccess, getSessionList } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage(setProtectedRoute("/profile"), true),
};

export default async function Page() {
  const { session, menu } = await checkRouteAccess(
    setProtectedRoute("/profile"),
  );

  const sessionList = await getSessionList();

  return (
    <Section currentPage={menu.displayName} className="items-center">
      <Card
        id="personal-information"
        className="w-full scroll-m-20 lg:max-w-2xl"
      >
        <CardHeader>
          <CardTitle>{dashboardPage.profile.info.title}</CardTitle>
          <CardDescription>{dashboardPage.profile.info.desc}</CardDescription>
        </CardHeader>

        <Separator />

        <PersonalInformation {...session.user} />
      </Card>

      <Card id="change-password" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>{dashboardPage.profile.password.title}</CardTitle>
          <CardDescription>
            {dashboardPage.profile.password.desc}
          </CardDescription>
        </CardHeader>

        <Separator />

        <ChangePasswordForm />
      </Card>

      <Card id="active-session" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>{dashboardPage.profile.activeSession.title}</CardTitle>
          <CardDescription>
            {dashboardPage.profile.activeSession.desc}
          </CardDescription>
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
            {dashboardPage.profile.deleteAccount.title}
          </CardTitle>
          <CardDescription>
            {dashboardPage.profile.deleteAccount.desc}
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <DeleteMyAccountButton {...session.user} />
        </CardContent>
      </Card>
    </Section>
  );
}
