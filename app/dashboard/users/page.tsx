import { DashboardMain } from "@/components/layout/section";
import {
  AdminCreateUserDialog,
  UserDataTable,
} from "@/components/modules/user-client";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTitle } from "@/lib/utils";
import { getUserList, requireAuth } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/users") };

export default async function Page() {
  const { session, meta } = await requireAuth("/dashboard/users");
  const data = await getUserList();

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

      <UserDataTable
        data={data.users}
        currentUserId={session.user.id}
        searchPlaceholder="Cari Pengguna..."
      />
    </DashboardMain>
  );
}
