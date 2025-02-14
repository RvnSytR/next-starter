import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Role } from "@/server/db/schema";

type SidebarData = {
  username: string;
  email: string;
  role: Exclude<Role, "pending">;
};

export function AppSidebar({
  username,
  email,
  role,
  children,
}: SidebarData & React.ComponentProps<"div">) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Head username={username} email={email} />
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

function Head({ username, email }: { username: string; email: string }) {
  return (
    <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:my-2">
      <Avatar className="rounded-md">
        <AvatarFallback className="rounded-md">
          {username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="grid truncate leading-tight [&_span]:truncate">
        <span className="text-sm font-semibold">{username}</span>
        <span className="text-xs">{email}</span>
      </div>
    </SidebarMenuButton>
  );
}

function Content({ role }: Pick<SidebarData, "role">) {
  return <div>{role}</div>;
}

function Footer() {
  return <div>Footer</div>;
}
