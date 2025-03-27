import { Section, SectionTitle } from "@/components/layout/section";
import { PersonalInformation, ProfilePicture } from "@/components/modules/auth";

import { getCurrentPage } from "@/lib/menu";
import { getSession } from "@/server/auth-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getCurrentPage("/profile", true, true),
};

export default async function Page() {
  const currentPage = getCurrentPage("/profile", false, true);
  const session = await getSession();
  if (!session) return;

  return (
    <Section currentPage={currentPage}>
      <SectionTitle text={currentPage} />

      <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
        <ProfilePicture {...session.user} />
        <PersonalInformation {...session.user} />
      </div>
    </Section>
  );
}
