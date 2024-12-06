// import { CustomButton } from "@/components/global/custom-button";
import { ThemeToggle } from "@/components/global/theme-provider";
// import { FlaskConical, LayoutDashboard } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4 text-center">
      <p>Hello World!</p>

      <ThemeToggle />
      {/* <CustomButton
        customType="nav"
        href="/dashboard"
        icon={<LayoutDashboard />}
        variant="outline"
      >
        Go to Dashboard
      </CustomButton>

      <CustomButton
        customType="nav"
        href="/testing"
        icon={<FlaskConical />}
        variant="outline"
      >
        Go to Testing Page
      </CustomButton> */}
    </div>
  );
}
