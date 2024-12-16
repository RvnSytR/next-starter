import Link from "next/link";
import { Fragment } from "react";

import { Role } from "@/lib/db/schema";
import { GetMenuByRole } from "../content";
import { ThemeToggle } from "../global/theme-provider";
import { CustomButton } from "../global/custom-button";
import { CustomLoader } from "../global/icon";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, SidebarIcon } from "lucide-react";

type SiderbarHeaderData = {
  username: string;
  email: string;
  role: Exclude<Role, "pending">;
};

function Sidebar({
  data,
  children,
}: {
  data: SiderbarHeaderData;
  children: React.ReactNode;
}) {
  const header = <SidebarHeader data={data} />;
  const footer = <SidebarFooter />;

  return (
    <Sheet>
      <SheetContent side="left" className="flex flex-col gap-y-4">
        <SheetHeader>{header}</SheetHeader>
        <SidebarContent role={data.role} className="h-5/6" />
        {footer}
      </SheetContent>

      <main className="flex min-h-screen">
        <aside className="sticky left-0 top-0 hidden flex-col gap-y-4 border border-transparent p-6 lg:flex">
          {header}
          <SidebarContent role={data.role} className="grow" />
          {footer}
        </aside>

        <div className="flex grow flex-col gap-y-4 rounded-md border p-4 shadow-sm lg:m-2 lg:ml-0">
          {children}
        </div>
      </main>
    </Sheet>
  );
}

function SidebarHeader({ data }: { data: SiderbarHeaderData }) {
  return (
    <div className="cursor-default space-y-2">
      <div className="flex items-center gap-x-3">
        <Avatar className="rounded-md">
          <AvatarFallback className="rounded-md">
            {data.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-ellipsis">
          <SheetTitle className="line-clamp-1 text-left text-base">
            {data.username}
          </SheetTitle>
          <SheetDescription className="line-clamp-1 text-left text-xs">
            {data.email}
          </SheetDescription>
        </div>
      </div>

      <Separator />
    </div>
  );
}

function SidebarContent({
  className,
  role,
}: {
  className?: string;
  role: Exclude<Role, "pending">;
}) {
  const menu = GetMenuByRole(role);
  return (
    <ScrollArea className={className}>
      <div className="flex flex-col gap-y-4">
        {menu.map((item, index) => (
          <Fragment key={index}>
            <div key={index} className="space-y-1">
              <small className="font-medium text-muted-foreground">
                {item.section}
              </small>

              <div className="flex flex-col gap-y-1">
                {item.body.map((itm, ind) => (
                  <SheetClose key={ind} asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start gap-x-4"
                      asChild
                    >
                      <Link href={itm.href}>
                        {itm.icon && <itm.icon />} {itm.label}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </div>

            {index !== menu.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}

function SidebarFooter() {
  return (
    <footer className="space-y-2">
      <CustomButton
        customType="nav"
        load={false}
        href="/"
        size="sm"
        variant="link"
        target="_blank"
        icon={<ExternalLink />}
        className="w-full justify-start"
      >
        Something
      </CustomButton>

      <CustomButton
        customType="logout"
        variant="outline_destructive"
        className="w-full"
      />
    </footer>
  );
}

function SidebarSkeleton() {
  return (
    <main className="flex min-h-screen">
      <aside className="hidden basis-1/6 p-2 lg:flex">
        <div className="flex size-full flex-col items-center justify-between p-4">
          <div className="skeleton h-10 w-full" />
          <CustomLoader />
          <div className="skeleton h-10 w-full" />
        </div>
      </aside>

      <div className="flex grow flex-col justify-between rounded-md p-4 shadow lg:m-2 lg:border">
        <header className="space-y-2">
          <div className="flex items-center">
            <div className="flex grow items-center gap-x-2">
              <Button
                size="iconsm"
                variant="ghost"
                className="flex lg:hidden"
                disabled
              >
                <SidebarIcon />
              </Button>

              <Separator
                orientation="vertical"
                className="mr-2 flex h-4 lg:hidden"
              />

              <div className="skeleton h-4 w-full md:w-24" />
            </div>

            <ThemeToggle disabled />
          </div>

          <Separator />
        </header>

        <CustomLoader className="m-auto" />

        <footer className="space-y-4">
          <Separator />
          <div className="skeleton h-4 w-full" />
        </footer>
      </div>
    </main>
  );
}

export { Sidebar, SidebarSkeleton };
