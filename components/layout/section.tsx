import { cn } from "@/lib/utils";

import { ICON_SIZE } from "../global/icon";
import { Hash } from "lucide-react";

export function SectionTitle({
  withHash,
  className,
  children,
}: {
  withHash?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h5
      className={cn(
        "line-clamp-2 flex items-center gap-x-3 leading-tight",
        className,
      )}
    >
      {withHash && (
        <Hash
          size={ICON_SIZE.base}
          className="text-muted-foreground flex-none"
        />
      )}
      {children}
    </h5>
  );
}

export function SectionLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center p-20",
        className,
      )}
    >
      <p className="text-center text-sm font-normal">{children}</p>
    </div>
  );
}
