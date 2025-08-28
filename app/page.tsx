import { Example } from "@/components/modules/example";
import { LinkLoader, ThemeToggle } from "@/components/other/buttons";
import { R } from "@/components/other/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-y-4">
        <R />

        <div className="animate-fade flex flex-wrap gap-2 delay-750">
          <ThemeToggle variant="outline_primary" />

          <Button variant="outline_primary" asChild>
            <Link href="/dashboard">
              Ke Dashboard <LinkLoader icon={{ base: <ArrowRight /> }} />
            </Link>
          </Button>
        </div>
      </div>

      <Example />
    </div>
  );
}
