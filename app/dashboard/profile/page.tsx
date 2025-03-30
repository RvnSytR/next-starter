import { Section, SectionNotFound } from "@/components/layout/section";
import { PersonalInformation } from "@/components/modules/auth";
import {
  Card,
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

      <Card id="signIn-information" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle>{page.profile.signInInformation.title}</CardTitle>
          <CardDescription>
            {page.profile.signInInformation.subtitle}
          </CardDescription>
        </CardHeader>

        <Separator />
      </Card>

      <Card id="danger-zone" className="scroll-m-4 lg:w-xl">
        <CardHeader>
          <CardTitle className="text-destructive">
            {page.profile.dangerZone.title}
          </CardTitle>
          <CardDescription>{page.profile.dangerZone.subtitle}</CardDescription>
        </CardHeader>

        <Separator />
      </Card>
    </Section>
  );
}
