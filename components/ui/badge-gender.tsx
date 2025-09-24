import { Gender, genderMeta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export function GenderBadge({
  gender,
  className,
}: {
  gender: Gender;
  className?: string;
}) {
  const { displayName, icon: Icon, color } = genderMeta[gender];
  return (
    <Badge
      variant="outline"
      style={{ "--badge-color": color } as React.CSSProperties}
      className={cn(
        "border-[var(--badge-color)] text-[var(--badge-color)]",
        className,
      )}
    >
      <Icon /> {displayName}
    </Badge>
  );
}
