import { CustomButton } from "@/components/custom/custom-button";
import { References } from "@/components/modules/references";
import { ThemeToggle } from "@/components/other/theme";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, LayoutDashboard, LogIn } from "lucide-react";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-4 py-8">
      <div className="flex flex-wrap gap-2">
        <ThemeToggle size="icon" variant="outline" />

        <CustomButton
          href="/dashboard"
          icon={<LayoutDashboard />}
          variant="outline"
          text="Go To Dashboard"
          onClickLoading
        />

        <CustomButton
          href="/auth"
          icon={<LogIn />}
          variant="outline"
          text="Go To Login Page"
          onClickLoading
        />

        <CustomButton
          href="/test"
          icon={<FlaskConical />}
          variant="outline"
          text="Go To Testing Page"
          onClickLoading
        />
      </div>

      <Separator />

      <References />
    </div>
  );
}
