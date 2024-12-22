import { Metadata } from "next";

import {
  Section,
  SectionDescription,
  SectionGroup,
  SectionHeader,
  SectionTitle,
} from "@/components/layout/section";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/dashboard", true),
};

export default function Page() {
  return (
    <Section currentPage={GetCurrentPage("/dashboard")}>
      <SectionGroup>
        <SectionHeader>
          <SectionTitle withHash>Section Title</SectionTitle>
          <SectionDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            nostrum dolorum ratione est. Est asperiores beatae nihil aliquid
            provident. Incidunt dolores maiores autem ab facere quasi suscipit.
            Sed, laudantium minima.
          </SectionDescription>
        </SectionHeader>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, id
          in ad mollitia, eos nesciunt rem voluptate maiores libero aut eaque
          culpa veritatis deleniti saepe quisquam esse molestiae perspiciatis?
          Ipsam.
        </p>
      </SectionGroup>
    </Section>
  );
}
