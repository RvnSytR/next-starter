import Link from "next/link";

import type { Role } from "@/server/db/schema";
import { GetMenuByRole } from "../menu";
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
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChevronRight, ExternalLink } from "lucide-react";

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

          <Separator />
        </SidebarHeader>

        <SidebarContent>
          <Content role={role} />
        </SidebarContent>

        <SidebarFooter>
          <Separator />

          <Secondary />

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
  const menu = GetMenuByRole(role);

  return menu.map((item, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {item.body.map((bodyItem, bodyIndex) => (
          <Collapsible key={bodyIndex} disabled={bodyItem.isDisable} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={bodyItem.label} asChild>
                <Link href={bodyItem.href}>
                  {bodyItem.icon && <bodyItem.icon />}
                  {bodyItem.label}
                </Link>
              </SidebarMenuButton>

              {bodyItem.subMenu && (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {bodyItem.subMenu.map((subItem, subIndex) => (
                        <SidebarMenuSubItem key={subIndex}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.elementId}>
                              {subItem.subLabel}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function Secondary() {
  return (
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
  );
}
