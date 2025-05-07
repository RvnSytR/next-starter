import { Session } from "@/lib/auth";
import {
  footerSidebarMenu,
  getMenuByRole,
  setProtectedRoute,
} from "@/lib/menu";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LinkLoader } from "../custom/custom-button";
import { SignOutButton, UserAvatar } from "../modules/auth";
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

type SidebarData = Pick<Session["user"], "name" | "email" | "image"> & {
  role: string;
};

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
          <SidebarSeparator />
        </SidebarHeader>

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
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group/head-button group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:p-0"
          asChild
        >
          <Link href={setProtectedRoute("/profile")}>
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
  return getMenuByRole(role).map((item, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>{item.section}</SidebarGroupLabel>

      <SidebarMenu>
        {item.body.map((bodyItem, bodyIndex) => {
          const { href, label, disabled, subMenu } = bodyItem;
          return (
            <SCCollapsible
              key={bodyIndex}
              pathname={href}
              disabled={disabled}
              asChild
            >
              <SidebarMenuItem>
                <SCMenuButton pathname={href} tooltip={label} asChild>
                  <Link href={href}>
                    <LinkLoader
                      defaultIcon={bodyItem.icon && <bodyItem.icon />}
                    />
                    {label}
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
                                href={`${href}/#${subItem.elementId}`}
                                className="flex justify-between"
                              >
                                {subItem.subLabel}
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
      {footerSidebarMenu.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton size="sm" tooltip={item.label} asChild>
            <Link href={item.href}>
              <LinkLoader defaultIcon={item.icon && <item.icon />} />
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
