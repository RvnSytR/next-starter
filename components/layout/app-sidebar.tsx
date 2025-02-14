import type { Role } from "@/server/db/schema";

import { CustomButton } from "../custom/custom-button";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenu,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type SidebarData = {
  username: string;
  email: string;
  role: Exclude<Role, "pending">;
};

export function AppSidebar({
  username,
  email,
  role,
  children,
}: SidebarData & React.ComponentProps<"div">) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Head username={username} email={email} />
        </SidebarHeader>

        <SidebarContent>
          <Content role={role} />

          <Secondary />
        </SidebarContent>

        <SidebarFooter>
          <CustomButton
            customType="logout"
            variant="outline_destructive"
            className="w-full"
          />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
}

function Head({ username, email }: { username: string; email: string }) {
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

function Content({ role }: Pick<SidebarData, "role">) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>{role}</SidebarGroupContent>
    </SidebarGroup>
  );
}

function Secondary() {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <Link href="/">
                <ExternalLink />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
