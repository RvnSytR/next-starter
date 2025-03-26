import { User } from "@/lib/auth";
import { getMenuByRole, secondaryMenu } from "@/lib/menu";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "../modules/auth";
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
} from "./sidebar-client";

type SidebarData = Pick<User, "name" | "email"> & { role: string };

export function SidebarApp({
  role,
  children,
  ...props
}: SidebarData & React.ComponentProps<"div">) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Head {...props} />
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <Content role={role} />
        </SidebarContent>

        <SidebarFooter>
          <Secondary />
          <SidebarSeparator />
          <Footer />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
}

function Head({ name, email }: Pick<SidebarData, "name" | "email">) {
  return (
    <SidebarMenuButton
      size="lg"
      className="group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
    >
      <Avatar className="rounded-md">
        <AvatarFallback className="rounded-md">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="grid [&_span]:truncate">
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-xs">{email}</span>
      </div>
    </SidebarMenuButton>
  );
}

function Content({ role }: Pick<SidebarData, "role">) {
  return getMenuByRole(role).map((item, index) => (
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
      <SidebarMenuItem>
        <SignOutButton />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
