import { CustomButton } from "@/components/custom/custom-button";
import { ThemeToggle } from "@/components/widgets/theme";
import { FlaskConical, LayoutDashboard } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Current Page",
// };

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4 text-center">
      <p>Hello World!</p>

      <ThemeToggle />

      <CustomButton
        customType="nav"
        href="/dashboard"
        icon={<LayoutDashboard />}
        variant="outline"
        text="Go To Dashboard"
      />

      <CustomButton
        customType="nav"
        href="/coverage"
        icon={<FlaskConical />}
        variant="outline"
        text="Go to Testing Page (Coverage)"
      />
    </div>
  );
}
