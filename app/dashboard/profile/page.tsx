import { Section, SectionNotFound } from "@/components/layout/section";
import {
  DeleteMyAccountButton,
  PersonalInformation,
} from "@/components/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { page } from "@/lib/content";
import { getCurrentPage } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/profile", true, true),
};

export default async function Page() {
  const currentPage = getCurrentPage("/profile", false, true);
  const session = await getSession();
  if (!session) return <SectionNotFound />;
  return (
    <Section currentPage={currentPage} className="items-center">
      <Card id="personal-information" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle>{page.profile.profile.title}</CardTitle>
          <CardDescription>{page.profile.profile.subtitle}</CardDescription>
        </CardHeader>

        <Separator />

        <PersonalInformation {...session.user} />
      </Card>

      <Card id="change-password" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle>{page.profile.password.title}</CardTitle>
          <CardDescription>{page.profile.password.subtitle}</CardDescription>
        </CardHeader>

        <Separator />
      </Card>

      <Card id="active-session" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle>{page.profile.activeSession.title}</CardTitle>
          <CardDescription>
            {page.profile.activeSession.subtitle}
          </CardDescription>
        </CardHeader>

        <Separator />
      </Card>

      <Card id="delete-account" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle className="text-destructive">
            {page.profile.deleteAccount.title}
          </CardTitle>
          <CardDescription>
            {page.profile.deleteAccount.subtitle}
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <DeleteMyAccountButton />
        </CardContent>
      </Card>
    </Section>
  );
}
