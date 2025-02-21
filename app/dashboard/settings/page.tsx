import { page } from "@/components/content";
import { Section, SectionNotFound } from "@/components/layout/section";
import { GetCurrentPage } from "@/components/menu";
import {
  UpdatePasswordForm,
  UpdateProfileForm,
} from "@/components/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = { title: GetCurrentPage("/settings", true) };

export default async function Page() {
  const session = await auth();
  if (!session) return <SectionNotFound />;

  const { id_user } = session.user;
  const { profile, password } = page.settings;

  return (
    <Section currentPage={GetCurrentPage("/dashboard/settings")}>
      <Card id="profile">
        <CardHeader>
          <CardTitle>{profile.title} </CardTitle>
          <CardDescription>{profile.subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateProfileForm data={session.user} />
        </CardContent>
      </Card>

      <Card className="password">
        <CardHeader>
          <CardTitle>{password.title} </CardTitle>
          <CardDescription>{password.subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <UpdatePasswordForm id={id_user} />
        </CardContent>
      </Card>
    </Section>
  );
}
