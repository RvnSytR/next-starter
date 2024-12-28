import Link from "next/link";
import { Fragment } from "react";

import { Role } from "@/lib/db/schema";
import { GetMenuByRole } from "../content";
import { CustomButton } from "../global/custom-button";

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
import { ExternalLink } from "lucide-react";

type SiderbarHeaderData = {
  username: string;
  email: string;
  role: Exclude<Role, "pending">;
};

export function Sidebar({
  children,
  ...data
}: {
  children: React.ReactNode;
} & SiderbarHeaderData) {
  const header = <SidebarHeader data={data} />;
  const footer = <SidebarFooter />;

  return (
    <Sheet>
      <SheetContent side="left" className="flex flex-col gap-y-4">
        <SheetHeader>{header}</SheetHeader>
        <SidebarContent role={data.role} className="h-5/6" />
        {footer}
      </SheetContent>

      <main className="flex min-h-dvh">
        <aside className="sticky left-0 top-0 hidden h-screen basis-1/6 flex-col gap-y-4 p-6 lg:flex">
          {header}
          <SidebarContent role={data.role} className="grow" />
          <Separator />
          {footer}
        </aside>

        <div className="flex basis-full flex-col gap-y-4 overflow-hidden p-4 shadow lg:m-2 lg:ml-0 lg:basis-5/6 lg:rounded-md lg:border">
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
            {index !== 0 && <Separator />}

            <div key={index} className="space-y-1">
              <small className="font-medium text-muted-foreground">
                {item.section}
              </small>

              {item.body.map((itm, ind) => (
                <SheetClose key={ind} asChild>
                  {itm.isDisable ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start gap-x-4"
                      disabled
                    >
                      {itm.icon && <itm.icon />} {itm.label}
                    </Button>
                  ) : (
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
                  )}
                </SheetClose>
              ))}
            </div>
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
        text="Something"
      />

      <CustomButton
        customType="logout"
        variant="outline_destructive"
        className="w-full"
      />
    </footer>
  );
}
