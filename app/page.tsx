import { LinkLoader } from "@/components/custom/custom-button";
import { References } from "@/components/modules/references";
import { R } from "@/components/other-ui/r";
import { ThemeToggle } from "@/components/other/theme";
import { Button } from "@/components/ui/button";
import { Route } from "@/lib/const";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-8 py-12 md:py-24">
      <div className="flex flex-col items-center gap-y-4">
        <R className="size-24" />

        <div className="flex flex-wrap gap-2">
          <ThemeToggle size="icon" variant="outline_primary" />

          <Button variant="outline_primary" asChild>
            <Link href={"/dashboard" satisfies Route}>
              Go To Dashboard
              <LinkLoader defaultIcon={<ArrowRight />} />
            </Link>
          </Button>
        </div>
      </div>

      <References />
    </div>
  );
}
