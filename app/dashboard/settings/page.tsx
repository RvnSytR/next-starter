import { Metadata } from "next";

import { auth } from "@/lib/auth";

import { page } from "@/components/content";
import { GetCurrentPage } from "@/components/menu";

import {
  UpdateProfileForm,
  UpdatePasswordForm,
} from "@/components/modules/auth";
import { Section, SectionNotFound } from "@/components/layout/section";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: GetCurrentPage("/settings", true) };

export default async function Page() {
  const session = await auth();
  if (!session) return <SectionNotFound />;

  const { id_user } = session.user;
  const { profile, password } = page.settings;

  return (
    <Section currentPage={GetCurrentPage("/dashboard/settings")}>
      <Card>
        <CardHeader>
          <CardTitle>{profile.title} </CardTitle>
          <CardDescription>{profile.subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateProfileForm data={session.user} />
        </CardContent>
      </Card>

      <Card>
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
