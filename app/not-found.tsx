import { LinkLoader } from "@/components/other/buttons";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh grow flex-col items-center justify-center gap-y-6 mask-radial-from-75% mask-alpha md:gap-y-2">
      <div className="z-50 flex flex-col items-center gap-x-4 text-shadow-sm md:flex-row">
        <h1 className="animate-fade-right text-primary text-8xl md:text-9xl">
          404
        </h1>
        <h2 className="animate-fade-left text-center leading-tight font-extrabold md:text-start md:text-5xl md:whitespace-pre-line">
          {"Oops, looks like\nthere's nobody here!"}
        </h2>
      </div>

      <Button
        size="lg"
        variant="ghost"
        className="hover:border-primary animate-fade-up z-50 h-12 rounded-full border-4 font-semibold shadow-sm"
        asChild
      >
        <Link href="/">
          <LinkLoader icon={{ base: <Home /> }} />
          Go To Main Page
        </Link>
      </Button>
    </div>
  );
}
