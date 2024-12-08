"use client";

import Link from "next/link";
import { Fragment } from "react";
import type { Session } from "next-auth";

import { cn } from "@/lib/utils";
import { type MenuRole, GetMenuByRole } from "../content";
import { CustomButton } from "@/components/global/custom-button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircleQuestion } from "lucide-react";

export function AppSidebar({
  session,
  ...props
}: { session: Session } & React.ComponentProps<typeof Sidebar>) {
  const { username, email, role } = session.user;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg">
          <Avatar className="size-8 rounded">
            <AvatarFallback className="rounded">
              {username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col justify-center truncate text-left text-sm leading-tight">
            <span className="font-semibold">{username}</span>
            <span className="text-xs">{email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        {role !== "pending" && <NavMenu role={role} />}
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        <CustomButton customType="logout" variant="outline_destructive" />
      </SidebarFooter>
    </Sidebar>
  );
}

export function NavMenu({ role }: { role: MenuRole }) {
  const menu = GetMenuByRole(role);
  return menu.map((item, index) => (
    <Fragment key={index}>
      {/* {index < menu.length - 1 && <SidebarSeparator />} */}
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>{item.section}</SidebarGroupLabel>
        <SidebarMenu>
          {item.body.map((itm, ind) => (
            <SidebarMenuItem key={ind}>
              <SidebarMenuButton disabled={itm.isDisable} asChild>
                <Link href={itm.href}>
                  {itm.icon && <itm.icon />}
                  <span className="transition group-data-[collapsible=icon]:hidden">
                    {itm.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </Fragment>
  ));
}

export function NavSecondary({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup className={cn("mt-auto", className)} {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Link href="/">
                <MessageCircleQuestion />
                Something
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
