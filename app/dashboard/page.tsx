import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/global/theme-provider";
import { CustomButton } from "@/components/global/custom-button";
import { Home } from "lucide-react";

export default async function Page() {
  const session = await auth();

  return (
    <div className="container flex min-h-dvh flex-col items-center justify-center gap-y-4 text-center">
      <p>Hello from Dashboard!</p>

      <ThemeToggle />

      <p>{JSON.stringify(session)}</p>

      <CustomButton customType="nav" href="/" icon={<Home />} variant="outline">
        Go to Main Page
      </CustomButton>

      <CustomButton customType="logout" variant="outline_destructive">
        Log Out
      </CustomButton>
    </div>
  );
}
