import { LinkLoader } from "@/components/custom/custom-button";
import { References } from "@/components/modules/references";
import { ThemeToggle } from "@/components/other/theme";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { route } from "@/lib/const";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-4 py-8">
      <div className="flex flex-wrap gap-2">
        <ThemeToggle size="icon" variant="outline" />

        <Button variant="outline" asChild>
          <Link href={route.protected}>
            <LinkLoader defaultIcon={<LayoutDashboard />} />
            Go To Dashboard
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href={route.signIn}>
            <LinkLoader defaultIcon={<LogIn />} />
            Go To Login Page
          </Link>
        </Button>
      </div>

      <Separator />

      <References />
    </div>
  );
}
