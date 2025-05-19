import { LinkLoader } from "@/components/custom/custom-button";
import { GridPattern } from "@/components/other-ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh grow flex-col items-center justify-center gap-y-6 mask-radial-from-75% mask-alpha md:gap-y-2">
      <GridPattern className="stroke-input/35" />

      <div className="z-50 flex flex-col items-center gap-x-4 text-shadow-sm md:flex-row">
        <h1 className="animate-fade-right text-9xl">404</h1>
        <h1 className="animate-fade-left text-center leading-tight whitespace-pre-line lg:text-start">
          {"Oops, looks like\nthere's nobody here!"}
        </h1>
      </div>

      <Button
        size="lg"
        variant="ghost"
        className="hover:border-primary animate-fade-up z-50 h-12 rounded-full border-4 font-semibold shadow-sm"
        asChild
      >
        <Link href="/">
          <LinkLoader defaultIcon={<Home />} />
          Go To Main Page
        </Link>
      </Button>
    </div>
  );
}
