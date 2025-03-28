import { User } from "@/lib/auth";
import { footerSidebarMenu, getMenuByRole, route } from "@/lib/menu";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "../modules/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { CSCollapsible, CSMenuButton } from "./sidebar-client";

type SidebarData = Pick<User, "name" | "email" | "image"> & { role: string };

export function SidebarApp({
  role,
  children,
  ...props
}: SidebarData & React.ComponentProps<"div">) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Head {...props} />
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <Content role={role} />
        </SidebarContent>

        <SidebarFooter>
          <Footer />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
}

function Head({ name, email, image }: Omit<SidebarData, "role">) {
  return (
    <SidebarMenuButton
      size="lg"
      className="group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
      asChild
    >
      <Link href={`${route.protected}/profile`}>
        <Avatar className="rounded-md">
          {image && <AvatarImage className="rounded-md" src={image} />}
          <AvatarFallback className="rounded-md">
            {name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="grid [&_span]:truncate">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs">{email}</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
}

function Content({ role }: Pick<SidebarData, "role">) {
  return getMenuByRole(role).map((item, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>{item.section}</SidebarGroupLabel>

      <SidebarMenu>
        {item.body.map((bodyItem, bodyIndex) => {
          const { href, label, disabled, subMenu } = bodyItem;
          return (
            <CSCollapsible
              key={bodyIndex}
              pathname={href}
              disabled={disabled}
              asChild
            >
              <SidebarMenuItem>
                <CSMenuButton pathname={href} tooltip={label} asChild>
                  <Link href={href}>
                    {bodyItem.icon && <bodyItem.icon />}
                    {label}
                  </Link>
                </CSMenuButton>

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
                            <SidebarMenuSubButton
                              className={subItem.className}
                              asChild
                            >
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
            </CSCollapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function Footer() {
  return (
    <SidebarMenu className="gap-2">
      {footerSidebarMenu.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton size="sm" tooltip={item.label} asChild>
            <Link href={item.href}>
              {item.icon && <item.icon />}
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <SidebarSeparator />

      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Sign Out" asChild>
          <SignOutButton />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
