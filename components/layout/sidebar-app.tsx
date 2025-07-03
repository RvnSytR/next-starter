import { Session } from "@/lib/auth";
import { dashboardfooterMenu, Route, routesMeta } from "@/lib/const";
import { Role } from "@/lib/permission";
import { getMenuByRole, toKebabCase } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LinkLoader } from "../custom/custom-button";
import { SignOutButton, UserAvatar } from "../modules/auth";
import { Spinner } from "../other/icon";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
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
import { SCCollapsible, SCMenuButton } from "./sidebar-client";

type SidebarData = Pick<Session["user"], "name" | "email" | "image" | "role">;

export function SidebarApp({
  children,
  ...props
}: SidebarData & { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Head {...props} />
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <Content {...props} />
        </SidebarContent>

        <SidebarFooter>
          <Footer />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

function Head({ name, email, image }: Omit<SidebarData, "role">) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group/head-button group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
          asChild
        >
          <Link href={"/dashboard/profile" satisfies Route}>
            <UserAvatar
              name={name}
              image={image}
              className="rounded-md"
              imageCn="group-hover/head-button:scale-125"
              fallbackCn="group-hover/head-button:scale-125"
            />

            <div className="grid [&_span]:truncate">
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-xs">{email}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function Content({ role }: Pick<SidebarData, "role">) {
  if (!role) {
    return (
      <SidebarGroup className="flex h-full items-center justify-center">
        <Spinner />
      </SidebarGroup>
    );
  }

  return getMenuByRole(role as Role).map(({ section, content }, i) => (
    <SidebarGroup key={i}>
      <SidebarGroupLabel>{section}</SidebarGroupLabel>

      <SidebarMenu>
        {content.map(({ route, icon: MenuIcon, disabled, subMenu }, index) => {
          const { displayName } = routesMeta[route];
          if (disabled) {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton disabled>
                  {MenuIcon && <MenuIcon />}
                  <span className="line-clamp-1">{displayName}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <SCCollapsible key={index} route={route} asChild>
              <SidebarMenuItem>
                <SCMenuButton route={route} tooltip={displayName} asChild>
                  <Link href={route}>
                    <LinkLoader defaultIcon={MenuIcon && <MenuIcon />} />
                    <span className="line-clamp-1">{displayName}</span>
                  </Link>
                </SCMenuButton>

                {subMenu && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subMenu.map(({ label, className }, idx) => (
                          <SidebarMenuSubItem key={idx}>
                            <SidebarMenuSubButton className={className} asChild>
                              <Link
                                href={`${route}/#${toKebabCase(label)}`}
                                className="flex justify-between"
                              >
                                <span className="line-clamp-1">{label}</span>
                                <LinkLoader />
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </SCCollapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function Footer() {
  return (
    <SidebarMenu className="gap-2">
      {dashboardfooterMenu.map(
        ({ icon: FooterIcon, displayName, path }, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton size="sm" tooltip={displayName} asChild>
              <Link href={path}>
                <LinkLoader defaultIcon={FooterIcon && <FooterIcon />} />
                {displayName}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ),
      )}

      <SidebarSeparator />

      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Sign Out" asChild>
          <SignOutButton />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
