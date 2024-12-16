import { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { GetCurrentPage } from "@/components/content";

export const metadata: Metadata = {
  title: GetCurrentPage("/dashboard", true),
};

export default function Page() {
  return (
    <Section currentPage={GetCurrentPage("/dashboard")}>
      <div className="min-h-screen">
        <p>Hello world</p>
      </div>

      <p>Hello world</p>
    </Section>
  );
}
