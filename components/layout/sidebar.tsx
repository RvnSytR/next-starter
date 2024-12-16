import Link from "next/link";
import { Fragment } from "react";

import { Role } from "@/lib/db/schema";
import { GetMenuByRole } from "../content";
import { ThemeToggle } from "../global/theme-provider";
import { CustomButton } from "../global/custom-button";

import {
  Sheet,
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
import { CustomLoader } from "../global/icon";

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
  return (
    <Sheet>
      <SheetContent side="left">
        <SheetHeader>
          <SidebarHeader data={data} />
        </SheetHeader>
      </SheetContent>

      <main className="flex min-h-screen">
        <aside className="sticky left-0 top-0 hidden h-screen basis-1/6 p-2 lg:flex">
          <div className="flex size-full flex-col gap-y-4 p-4">
            <SidebarHeader data={data} />
            <SidebarContent role={data.role} />
            <SidebarFooter />
          </div>
        </aside>

        <div className="flex flex-1 flex-col gap-y-4 rounded-md p-4 shadow lg:m-2 lg:border">
          {children}
        </div>
      </main>
    </Sheet>
  );
}

function SidebarHeader({ data }: { data: SiderbarHeaderData }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-3">
        <Avatar className="rounded-md">
          <AvatarFallback className="rounded-md">
            {data.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-ellipsis">
          <SheetTitle className="line-clamp-1 text-sm">
            {data.username}
          </SheetTitle>
          <SheetDescription className="line-clamp-1 text-xs">
            {data.email}
          </SheetDescription>
        </div>
      </div>

      <Separator />
    </div>
  );
}

function SidebarContent({ role }: { role: Exclude<Role, "pending"> }) {
  const menu = GetMenuByRole(role);
  return (
    <ScrollArea className="grow">
      <div className="flex flex-col gap-y-4">
        {menu.map((item, index) => (
          <Fragment key={index}>
            <div key={index} className="space-y-1">
              <small className="font-medium text-muted-foreground">
                {item.section}
              </small>

              <div className="flex flex-col gap-y-1">
                {item.body.map((itm, ind) => (
                  <Button
                    key={ind}
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start gap-x-4"
                    asChild
                  >
                    <Link href={itm.href}>
                      {itm.icon && <itm.icon />} {itm.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />
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
        size="lg"
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

      <div className="flex flex-1 flex-col justify-between rounded-md p-4 shadow lg:m-2 lg:border">
        <header className="space-y-2 lg:space-y-1.5">
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
