import { Role, rolesMeta } from "@/lib/permission";
import { cn } from "@/lib/utils";
import { UserWithRole } from "better-auth/plugins";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function UserRoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  const { displayName, desc, icon: Icon, color } = rolesMeta[role];
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge
          variant="outline"
          style={{ "--badge-color": color } as React.CSSProperties}
          className={cn(
            "border-[var(--badge-color)] text-[var(--badge-color)] capitalize",
          )}
        >
          <Icon /> {displayName ?? role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{desc}</TooltipContent>
    </Tooltip>
  );
}

export function UserVerifiedBadge({
  withoutText = false,
  className,
  classNames,
}: {
  withoutText?: boolean;
  className?: string;
  classNames?: { badge?: string; icon?: string; content?: string };
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {withoutText ? (
          <BadgeCheck
            className={cn("text-rvns size-4 shrink-0", classNames?.icon)}
          />
        ) : (
          <Badge
            variant="outline_rvns"
            className={cn("capitalize", classNames?.badge)}
          >
            <BadgeCheck className={classNames?.icon} /> Terverifikasi
          </Badge>
        )}
      </TooltipTrigger>
      <TooltipContent className={classNames?.content}>
        Pengguna ini telah memverifikasi email mereka.
      </TooltipContent>
    </Tooltip>
  );
}

export function UserAvatar({
  image,
  name,
  className,
  classNames,
}: Pick<UserWithRole, "image" | "name"> & {
  className?: string;
  classNames?: { image?: string; fallback?: string };
}) {
  return (
    <Avatar className={cn("rounded-xl", className)}>
      <AvatarImage
        src={image || undefined}
        className={cn("rounded-xl", classNames?.image)}
      />
      <AvatarFallback className={cn("rounded-xl", classNames?.fallback)}>
        {name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
