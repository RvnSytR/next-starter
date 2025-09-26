import { DashboardMain } from "@/components/layout/section";
import { UserRoleBadge, UserVerifiedBadge } from "@/components/modules/user";
import {
  ActiveSessionButton,
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeOtherSessionsButton,
} from "@/components/modules/user-client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appMeta } from "@/lib/meta";
import { Role } from "@/lib/permission";
import { getTitle } from "@/lib/utils";
import { getListSession, requireAuth } from "@/server/action";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/profile") };

export default async function Page() {
  const {
    session: { session, user },
    meta,
  } = await requireAuth("/dashboard/profile");
  const sessionList = await getListSession();

  return (
    <DashboardMain currentPage={meta.displayName} className="items-center">
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <UserRoleBadge role={user.role as Role} />
            {user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <PersonalInformation {...user} />
      </Card>

      <Card id="ubah-kata-sandi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>

      <Card id="sesi-aktif" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Sesi Aktif</CardTitle>
          <CardDescription>
            Tinjau dan kelola sesi yang saat ini sedang masuk ke akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-2">
          {sessionList.map((item) => (
            <ActiveSessionButton
              key={item.id}
              currentSessionId={session.id}
              {...item}
            />
          ))}
        </CardContent>

        <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="hapus-akun" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>
            Peringatan: Tindakan ini bersifat permanen dan tidak dapat
            dibatalkan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DeleteMyAccountButton {...user} />
        </CardContent>
      </Card>
    </DashboardMain>
  );
}
