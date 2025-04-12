import { SectionError } from "@/components/layout/section";
import { GridPattern } from "@/components/magicui/grid-pattern";

export default function NotFound() {
  return (
    <SectionError className="min-h-dvh">
      <GridPattern className="stroke-input/50 z-[-1]" />
    </SectionError>
  );
}
