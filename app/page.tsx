import { LinkLoader } from "@/components/custom/custom-button";
import { Example } from "@/components/modules/example";
import { R } from "@/components/other-ui/r";
import { ThemeToggle } from "@/components/other/theme";
import { Button } from "@/components/ui/button";
import { Route } from "@/lib/const";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-y-4">
        <R />

        <div className="animate-fade flex flex-wrap gap-2 delay-750">
          <ThemeToggle size="icon" variant="outline_primary" />

          <Button variant="outline_primary" asChild>
            <Link href={"/dashboard" satisfies Route}>
              Go To Dashboard
              <LinkLoader defaultIcon={<ArrowRight />} />
            </Link>
          </Button>
        </div>
      </div>

      <Example />
    </div>
  );
}
