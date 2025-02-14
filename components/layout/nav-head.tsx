import { Avatar, AvatarFallback } from "../ui/avatar";
import { SidebarMenuButton } from "../ui/sidebar";

export type UserNavHead = { username: string; email: string };

export function NavHead({ username, email }: UserNavHead) {
  return (
    <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:my-2">
      <Avatar className="rounded-md">
        <AvatarFallback className="rounded-md">
          {username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="grid truncate leading-tight [&_span]:truncate">
        <span className="text-sm font-semibold">{username}</span>
        <span className="text-xs">{email}</span>
      </div>
    </SidebarMenuButton>
  );
}
