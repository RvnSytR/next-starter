import { CustomButton } from "@/components/custom/custom-button";
import { ThemeToggle } from "@/components/custom/theme";
import { References } from "@/components/modules/docs";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard } from "lucide-react";

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
      </div>

      <Separator />

      <References />
    </div>
  );
}
