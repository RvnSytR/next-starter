import type { Role } from "@/server/db/schema";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "../custom/custom-button";
import { GetMenuByRole, secondaryMenu } from "../menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "../ui/sidebar";
import {
  ClientSidebarCollapsible,
  ClientSidebarMenuButton,
} from "./client-sidebar";

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
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <Content role={role} />
        </SidebarContent>

        <SidebarFooter>
          <Secondary />
          <Footer />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
}

function Head({ username, email }: { username: string; email: string }) {
  return (
    <SidebarMenuButton
      size="lg"
      className="group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
    >
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
      <SidebarGroupLabel>{item.section}</SidebarGroupLabel>

      <SidebarMenu>
        {item.body.map((bodyItem, bodyIndex) => {
          const { href, label, isDisable, subMenu } = bodyItem;
          return (
            <ClientSidebarCollapsible
              key={bodyIndex}
              pathname={href}
              disabled={isDisable}
              asChild
            >
              <SidebarMenuItem>
                <ClientSidebarMenuButton
                  pathname={href}
                  tooltip={label}
                  asChild
                >
                  <Link href={href}>
                    {bodyItem.icon && <bodyItem.icon />}
                    {label}
                  </Link>
                </ClientSidebarMenuButton>

                {subMenu && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subMenu.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton asChild>
                              <Link href={`${href}/#${subItem.elementId}`}>
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
            </ClientSidebarCollapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function Secondary() {
  return (
    <SidebarMenu>
      {secondaryMenu.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton size="sm" tooltip={item.label} asChild>
            <Link href={item.href}>
              {item.icon && <item.icon />}
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function Footer() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex h-12 flex-col justify-between">
        <SidebarSeparator />

        <CustomButton
          customType="logout"
          variant="outline_destructive"
          inSidebar
          onClickLoading
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
