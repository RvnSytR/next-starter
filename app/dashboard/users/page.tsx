import { DashboardMain } from "@/components/layout/section";
import { AdminCreateUserDialog } from "@/components/modules/user";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { routesMeta } from "@/lib/routes";
import { getTitle } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/users") };

export default async function Page() {
  const meta = routesMeta["/dashboard/users"];
  return (
    <DashboardMain currentPage={meta.displayName} className="pt-6">
      <CardHeader asPageHeader>
        <CardTitle>Manajemen {meta.displayName}</CardTitle>
        <CardDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </CardDescription>
        <CardAction asPageAction>
          <AdminCreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      {/* <UserDataTable
        data={data.users}
        currentUserId={session.user.id}
        searchPlaceholder="Cari Pengguna..."
      /> */}
    </DashboardMain>
  );
}
