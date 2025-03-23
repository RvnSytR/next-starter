import { CustomButton } from "@/components/custom/custom-button";
import { ThemeToggle } from "@/components/custom/theme";
import { References } from "@/components/modules/references";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, LayoutDashboard, LogIn } from "lucide-react";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-4 py-8">
      <div className="flex gap-2">
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
          href="/coverage"
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
