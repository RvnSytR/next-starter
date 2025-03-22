import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { SignInForm } from "@/components/modules/auth";
import { GetCurrentPage, path } from "@/lib/menu";
import { Metadata } from "next";

export const metadata: Metadata = { title: GetCurrentPage(path.signIn, true) };

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center">
      <AnimatedGridPattern className="animate-fade fill-input/25 stroke-input/25 z-[-1] delay-250" />

      <div className="container flex justify-center">
        <SignInForm className="animate-fade" />
      </div>
    </main>
  );
}
