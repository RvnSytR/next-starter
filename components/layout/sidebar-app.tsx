import { dashboardfooterMenu } from "@/lib/menu";
import { Role } from "@/lib/permission";
import { cn, getMenuByRole, toKebabCase } from "@/lib/utils";
import { UserWithRole } from "better-auth/plugins";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { routesMeta } from "../../lib/routes";
import { SignOutButton, UserAvatar, UserVerifiedBadge } from "../modules/user";
import { LinkLoader, RefreshButton } from "../ui/buttons";
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

type SidebarData = Pick<
  UserWithRole,
  "name" | "email" | "image" | "role" | "emailVerified"
>;

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding,margin] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
        outline_destructive:
          "text-destructive border border-destructive/30 bg-background shadow-xs hover:border-destructive dark:bg-destructive/5 dark:hover:bg-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function SidebarApp({
  data,
  children,
}: {
  data: UserWithRole;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Header {...data} />
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <Content {...data} />
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

function Header({
  name,
  email,
  image,
  emailVerified,
}: Omit<SidebarData, "role">) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group/head-button group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
          asChild
        >
          <Link href={"/dashboard/profile"}>
            <UserAvatar
              name={name}
              image={image}
              className="rounded-md"
              classNames={{
                image: "rounded-md group-hover/head-button:scale-125",
                fallback: "rounded-md group-hover/head-button:scale-125",
              }}
            />

            <div className="grid break-all [&_span]:line-clamp-1">
              <div className="flex items-center gap-x-2">
                <span className="text-sm font-semibold">{name}</span>
                {emailVerified && (
                  <UserVerifiedBadge
                    classNames={{ icon: "size-3.5" }}
                    withoutText
                  />
                )}
              </div>

              <span className="text-xs">{email}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function Content({ role }: Pick<SidebarData, "role">) {
  return getMenuByRole(role as Role).map(({ section, content }, i) => (
    <SidebarGroup key={i}>
      <SidebarGroupLabel>{section}</SidebarGroupLabel>

      <SidebarMenu>
        {content.map(({ route, icon: Icon, disabled, subMenu }) => {
          const { displayName } = routesMeta[route];
          if (disabled) {
            return (
              <SidebarMenuItem key={route}>
                <SidebarMenuButton disabled>
                  {Icon && <Icon />}
                  <span className="line-clamp-1">{displayName}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <SCCollapsible key={route} route={route} asChild>
              <SidebarMenuItem>
                <SCMenuButton route={route} tooltip={displayName} asChild>
                  <Link href={route}>
                    <LinkLoader icon={{ base: Icon && <Icon /> }} />
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
                                href={
                                  `${route}/#${toKebabCase(label)}` as Route
                                }
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
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Refresh Page" asChild>
          <RefreshButton
            size="sm"
            variant="ghost"
            className={cn(
              sidebarMenuButtonVariants({ size: "sm" }),
              "justify-start",
            )}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>

      {dashboardfooterMenu.map(({ url, displayName, icon: Icon, disabled }) => (
        <SidebarMenuItem key={url}>
          {disabled ? (
            <SidebarMenuButton size="sm" disabled>
              {Icon && <Icon />}
              {displayName}
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton size="sm" tooltip={displayName} asChild>
              <Link href={url}>
                <LinkLoader icon={{ base: Icon && <Icon /> }} />
                {displayName}
              </Link>
            </SidebarMenuButton>
          )}
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
