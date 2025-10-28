import { cn } from "@/utils";
import { LoaderIcon, PackageX } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Label } from "../ui/label";

export function Tagline({ className }: { className?: string }) {
  return (
    <small className={cn("text-muted-foreground", className)}>
      {"Built by "}
      <Link href="https://github.com/RvnSytR" className="link-underline">
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}

export function SheetDetails({
  data,
}: {
  data: {
    label: string;
    content: ReactNode;
    className?: string;
    classNames?: { label?: string; content?: string };
  }[];
}) {
  return data.map(({ label, content, className, classNames }, index) => (
    <div key={index} className={cn("grid gap-y-1", className)}>
      <Label className={classNames?.label}>{label}</Label>
      <div className={cn("text-muted-foreground text-sm", classNames?.content)}>
        {content ?? null}
      </div>
    </div>
  ));
}

export function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderIcon className="text-foreground size-4 animate-spin" />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideText = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideText?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-destructive/10 text-destructive flex flex-col items-center justify-center gap-2 rounded-md p-4 text-center text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        <PackageX className="size-4 shrink-0" /> {error?.code}
      </div>
      {!hideText && <p>{error?.message || "Tidak ada data"}</p>}
    </div>
  );
}
