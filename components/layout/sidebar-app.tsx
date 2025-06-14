import { Session } from "@/lib/auth";
import { dashboardfooterMenu, routeMetadata } from "@/lib/const";
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

      {children}
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
          <Link href={routeMetadata.profile.path}>
            <UserAvatar
              name={name}
              image={image}
              className="rounded-md"
              imageCn="rounded-md group-hover/head-button:scale-125"
              fallbackCn="rounded-md group-hover/head-button:scale-125"
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

  return getMenuByRole(role).map((item, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>{item.section}</SidebarGroupLabel>

      <SidebarMenu>
        {item.content.map(
          ({ route, icon: ContentIcon, disabled, subMenu }, bodyIndex) => {
            const { path, displayName } = routeMetadata[route];
            if (disabled) {
              return (
                <SidebarMenuItem key={bodyIndex}>
                  <SidebarMenuButton disabled>
                    {ContentIcon && <ContentIcon />}
                    <span className="line-clamp-1">{displayName}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <SCCollapsible key={bodyIndex} pathname={path} asChild>
                <SidebarMenuItem>
                  <SCMenuButton pathname={path} tooltip={displayName} asChild>
                    <Link href={path}>
                      <LinkLoader
                        defaultIcon={ContentIcon && <ContentIcon />}
                      />
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
                          {subMenu.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton
                                className={subItem.className}
                                asChild
                              >
                                <Link
                                  href={`${path}/#${toKebabCase(subItem.subLabel)}`}
                                  className="flex justify-between"
                                >
                                  <span className="line-clamp-1">
                                    {subItem.subLabel}
                                  </span>
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
          },
        )}
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
