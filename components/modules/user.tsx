"use client";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { actions, messages } from "@/lib/content";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { fieldsMeta, fileMeta } from "@/lib/meta";
import { Role, rolesMeta } from "@/lib/permission";
import { dashboardRoute, signInRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { zodSchemas, zodUser } from "@/lib/zod";
import {
  deleteProfilePicture,
  deleteUsers,
  revokeUserSessions,
} from "@/server/action";
import { getFilePublicUrl, uploadFiles } from "@/server/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Ban,
  Gamepad2,
  Info,
  Layers2,
  LogIn,
  LogOut,
  Monitor,
  MonitorOff,
  MonitorSmartphone,
  Save,
  Settings2,
  Smartphone,
  Tablet,
  Trash2,
  TriangleAlert,
  TvMinimal,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { z } from "zod";
import { getUserColumn } from "../data-table/column";
import { DataTable, OtherDataTableProps } from "../data-table/data-table";
import { SheetDetails } from "../layout/section";
import { ResetButton } from "../other/buttons";
import { Field } from "../other/form-fields";
import { GithubIcon, Loader } from "../other/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Form, FormField } from "../ui/form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { SidebarMenuButton } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const userFields = fieldsMeta.user;

const sharedText = {
  signIn: "Berhasil masuk - Selamat datang!",
  signOn: (social: string) => `Lanjutkan dengan ${social}`,

  passwordNotMatch: "Kata sandi tidak cocok - silakan periksa kembali.",
  revokeSession: "Cabut Sesi",
};

export function UserRoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  const { displayName, desc, icon: Icon, badgeVariant } = rolesMeta[role];
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge variant={badgeVariant} className="capitalize">
          <Icon /> {displayName ?? role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{desc}</TooltipContent>
    </Tooltip>
  );
}

export function UserVerifiedBadge({
  withoutText = false,
  className,
  classNames,
}: {
  withoutText?: boolean;
  className?: string;
  classNames?: { badge?: string; icon?: string; content?: string };
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {withoutText ? (
          <BadgeCheck
            className={cn("text-rvns size-4 shrink-0", classNames?.icon)}
          />
        ) : (
          <Badge
            variant="outline_rvns"
            className={cn("capitalize", classNames?.badge)}
          >
            <BadgeCheck className={classNames?.icon} /> Terverifikasi
          </Badge>
        )}
      </TooltipTrigger>
      <TooltipContent className={classNames?.content}>
        Pengguna ini telah memverifikasi email mereka.
      </TooltipContent>
    </Tooltip>
  );
}

export function UserAvatar({
  image,
  name,
  className,
  classNames,
}: Pick<Session["user"], "image" | "name"> & {
  className?: string;
  classNames?: { image?: string; fallback?: string };
}) {
  return (
    <Avatar className={cn("rounded-xl", className)}>
      {image && (
        <AvatarImage
          src={image}
          className={cn("rounded-xl", classNames?.image)}
        />
      )}

      <AvatarFallback className={cn("rounded-xl", classNames?.fallback)}>
        {name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserDataTable({
  data,
  currentUserId,
  ...props
}: OtherDataTableProps<Session["user"]> & {
  data: Session["user"][];
  currentUserId: string;
}) {
  const columns = getUserColumn(currentUserId);
  return (
    <DataTable
      data={data}
      columns={columns}
      enableRowSelection={({ original }) => original.id !== currentUserId}
      onRowSelection={(data, table) => {
        const filteredData = data.map(({ original }) => original);

        const clearRowSelection = () => table.resetRowSelection();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings2 /> {actions.action}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-center">
                Akun dipilih: {filteredData.length}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <AdminActionRevokeUserSessionsDialog
                  ids={filteredData.map(({ id }) => id)}
                  onSuccess={clearRowSelection}
                />
              </DropdownMenuItem>

              {/* // TODO */}
              <DropdownMenuItem asChild>
                <Button size="sm" variant="ghost_destructive" disabled>
                  <Ban /> Ban
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <AdminActionRemoveUsersDialog
                  data={filteredData}
                  onSuccess={clearRowSelection}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
      {...props}
    />
  );
}

export function UserDetailSheet({ data }: { data: Session["user"] }) {
  const [isOpen, setIsOpen] = useState(false);

  const details = [
    { label: userFields.id, content: data.id.slice(0, 7) },
    { label: userFields.email.label, content: data.email },
    {
      label: fieldsMeta.createdAt,
      content: messages.createdAgo(data.createdAt),
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-x-2">
        <SheetTrigger className="link">{data.email}</SheetTrigger>
        {data.emailVerified && <UserVerifiedBadge withoutText />}
      </div>

      <SheetContent>
        <SheetHeader className="flex-row items-center">
          <UserAvatar {...data} className="size-12" />

          <div className="flex flex-col">
            <SheetTitle className="text-base">Detail {data.name}</SheetTitle>
            <SheetDescription>
              Lihat informasi lengkap tentang akun {data.name}
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-y-3 overflow-y-auto px-4">
          <Separator />

          <div className="flex items-center gap-x-2">
            <UserRoleBadge role={data.role as Role} />
            {data.emailVerified && <UserVerifiedBadge />}
          </div>

          <SheetDetails data={details} />

          <Separator />

          <AdminChangeUserRoleForm data={data} setIsOpen={setIsOpen} />

          <Separator />

          {/* // TODO */}
          <Button variant="outline_primary" disabled>
            <Layers2 /> Tiru Sesi
          </Button>

          <AdminRevokeUserSessionsDialog {...data} />

          {/* // TODO */}
          <Button variant="outline_destructive" disabled>
            <Ban /> Ban {data.name}
          </Button>
        </div>

        <SheetFooter>
          <AdminRemoveUserDialog data={data} setIsOpen={setIsOpen} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      variant="outline_destructive"
      className="text-destructive hover:text-destructive justify-center"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        authClient.signOut({
          fetchOptions: {
            onError: ({ error }) => {
              toast.error(error.message);
              setIsLoading(false);
            },
            onSuccess: () => {
              toast.success("Berhasil keluar - Sampai jumpa!");
              router.push(signInRoute);
            },
          },
        });
      }}
    >
      <Loader loading={isLoading} icon={{ base: <LogOut /> }} /> Keluar
    </SidebarMenuButton>
  );
}

export function SignOnGithubButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Button
      variant="outline"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        authClient.signIn.social(
          {
            provider: "github",
            callbackURL: dashboardRoute,
            errorCallbackURL: signInRoute,
          },
          {
            onError: ({ error }) => {
              toast.error(error.message);
              setIsLoading(false);
            },
            onSuccess: () => {
              toast.success(sharedText.signIn);
            },
          },
        );
      }}
    >
      <Loader loading={isLoading} icon={{ base: <GithubIcon /> }} />
      {sharedText.signOn("Github")}
    </Button>
  );
}

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser.pick({
    email: true,
    password: true,
    rememberMe: true,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    authClient.signIn.email(
      { ...formData, callbackURL: signInRoute },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(sharedText.signIn);
        },
      },
    );
  };

  return (
    <Form form={form} onSubmit={formHandler}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => <Field field={field} {...userFields.email} />}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => <Field field={field} {...userFields.password} />}
      />

      <FormField
        control={form.control}
        name="rememberMe"
        render={({ field }) => (
          <Field field={field} {...userFields.rememberMe} />
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <Loader loading={isLoading} icon={{ base: <LogIn /> }} />
        Masuk ke Dashboard
      </Button>
    </Form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser
    .pick({
      name: true,
      email: true,
      newPassword: true,
      confirmPassword: true,
      agreement: true,
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      agreement: false,
    },
  });

  const formHandler = ({ newPassword, ...rest }: z.infer<typeof schema>) => {
    setIsLoading(true);
    authClient.signUp.email(
      { password: newPassword, ...rest },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(
            "Akun berhasil dibuat! Silakan masuk untuk melanjutkan.",
          );
          setIsLoading(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Form form={form} onSubmit={formHandler}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => <Field field={field} {...userFields.name} />}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => <Field field={field} {...userFields.email} />}
      />

      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <Field field={field} {...userFields.newPassword} />
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <Field field={field} {...userFields.confirmPassword} />
        )}
      />

      <FormField
        control={form.control}
        name="agreement"
        render={({ field }) => (
          <Field field={field} {...userFields.agreement} />
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <Loader loading={isLoading} icon={{ base: <UserRoundPlus /> }} />
        Daftar Sekarang
      </Button>
    </Form>
  );
}

export function ProfilePicture({
  id,
  name,
  image,
}: Pick<Session["user"], "id" | "name" | "image">) {
  const router = useRouter();
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  const contentType = "image";
  const schema = zodSchemas.file(contentType);

  const changeHandler = async (fileList: FileList) => {
    setIsChange(true);
    const files = Array.from(fileList).map((f) => f);

    const parseRes = schema.safeParse(files);
    if (!parseRes.success) return toast.error(parseRes.error.message);

    const file = files[0];
    const key = `${id}_${file.name}`;
    const url = await getFilePublicUrl(key);

    if (image && url !== image) await deleteProfilePicture(image);
    await uploadFiles({ files: [{ key, file }], ACL: "public-read" });

    authClient.updateUser(
      { image: url },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsChange(false);
        },
        onSuccess: () => {
          toast.success(messages.success("Foto profil Anda", "updated"));
          setIsChange(false);
          router.refresh();
        },
      },
    );
  };

  const deleteHandler = async () => {
    setIsRemoved(true);
    if (image) await deleteProfilePicture(image);

    await authClient.updateUser(
      { image: null },
      {
        onError: ({ error }) => {
          setIsRemoved(false);
          toast.error(error.message);
        },
        onSuccess: () => {
          setIsRemoved(false);
          router.refresh();
          toast.success(messages.success("Foto profil Anda", "removed"));
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <UserAvatar name={name} image={image} className="size-24" />

      <input
        type="file"
        ref={inputAvatarRef}
        accept={fileMeta[contentType].mimeTypes.join(", ")}
        className="hidden"
        onChange={(e) => {
          const fileList = e.currentTarget.files;
          if (fileList) changeHandler(fileList);
        }}
      />

      <div className="flex flex-col gap-y-2">
        <Label>{userFields.avatar}</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isChange || isRemoved}
            onClick={() => inputAvatarRef.current?.click()}
          >
            <Loader loading={isChange} /> {actions.upload} Avatar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline_destructive"
                disabled={!image || isChange || isRemoved}
              >
                <Loader loading={isRemoved} /> {actions.remove}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Foto Profil</AlertDialogTitle>
                <AlertDialogDescription>
                  Aksi ini akan menghapus foto profil Anda saat ini. Yakin ingin
                  melanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => deleteHandler()}
                >
                  {actions.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function PersonalInformation({ ...props }: Session["user"]) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { name, email } = props;
  const schema = zodUser.pick({ name: true, email: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name, email },
  });

  const formHandler = ({ name: newName }: z.infer<typeof schema>) => {
    if (newName === name) return toast.info(messages.noChanges("profil"));

    setIsLoading(true);
    authClient.updateUser(
      { name: newName },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(messages.success("Profil", "updated"));
          setIsLoading(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <Form form={form} onSubmit={formHandler}>
      <CardContent className="flex flex-col gap-y-4">
        <ProfilePicture {...props} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => <Field field={field} {...userFields.email} />}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => <Field field={field} {...userFields.name} />}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
        <Button type="submit" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <Save /> }} />
          {actions.update}
        </Button>

        <ResetButton fn={form.reset} />
      </CardFooter>
    </Form>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser
    .pick({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
      revokeOtherSessions: true,
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    authClient.changePassword(formData, {
      onError: ({ error }) => {
        toast.error(error.message);
        setIsLoading(false);
      },
      onSuccess: () => {
        toast.success(messages.success(userFields.password.label, "updated"));
        setIsLoading(false);
        form.reset();
        router.refresh();
      },
    });
  };

  return (
    <Form form={form} onSubmit={formHandler}>
      <CardContent className="flex flex-col gap-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <Field field={field} {...userFields.currentPassword} />
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <Field field={field} {...userFields.newPassword} />
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <Field field={field} {...userFields.confirmPassword} />
          )}
        />

        <FormField
          control={form.control}
          name="revokeOtherSessions"
          render={({ field }) => (
            <Field field={field} {...userFields.revokeOtherSessions} />
          )}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
        <Button type="submit" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <Save /> }} />
          {actions.update}
        </Button>

        <ResetButton fn={form.reset} />
      </CardFooter>
    </Form>
  );
}

export function ActiveSessionButton({
  currentSessionId,
  id,
  updatedAt,
  userAgent,
  token,
}: Session["session"] & { currentSessionId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isCurrentSession = currentSessionId === id;
  const { browser, os, device } = new UAParser(userAgent!).getResult();

  const DeviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    console: Gamepad2,
    smarttv: TvMinimal,
    wearable: MonitorSmartphone,
    xr: MonitorSmartphone,
    embedded: MonitorSmartphone,
    other: Monitor,
  }[device.type ?? "other"];

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeSession(
      { token },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Sesi berhasil dicabut.");
          setIsLoading(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <div className="bg-card flex items-center gap-x-4 rounded-lg border p-2 shadow-xs">
      <div className="flex grow items-center gap-x-2">
        <div className="bg-muted aspect-square size-fit rounded-md p-2">
          <DeviceIcons className="shrink-0" />
        </div>

        <div className="flex flex-col">
          <small className="font-medium">
            {`${browser.name ?? "Browser tidak diketahui"} di ${os.name ?? "sistem operasi yang tidak diketahui"}`}
          </small>

          {isCurrentSession ? (
            <small className="text-success order-1 font-medium">
              Sesi saat ini
            </small>
          ) : (
            <small className="text-muted-foreground order-3 line-clamp-1 font-normal">
              {messages.thingAgo("Terakhir terlihat", updatedAt)}
            </small>
          )}
        </div>
      </div>

      {!isCurrentSession && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="iconsm"
              variant="outline_destructive"
              disabled={isLoading}
            >
              <Loader loading={isLoading} icon={{ base: <LogOut /> }} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{sharedText.revokeSession}</AlertDialogTitle>
              <AlertDialogDescription>
                Sesi ini akan segera dihentikan dari perangkat yang dipilih.
                Yakin ingin melanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={clickHandler}>
                {actions.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function RevokeOtherSessionsButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeOtherSessions({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Semua sesi aktif lainnya berhasil dicabut.");
          setIsLoading(false);
          router.refresh();
        },
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <MonitorOff /> }} />
          Cabut Semua Sesi Lain
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOff /> Cabut Semua Sesi Lain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif lainnya akan dihentikan, kecuali sesi saat ini.
            Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteMyAccountButton({
  image,
}: Pick<Session["user"], "image">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    if (image) await deleteProfilePicture(image);

    authClient.deleteUser(
      { callbackURL: signInRoute },
      {
        onRequest: () => setIsLoading(true),
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(messages.success("Akun", "removed"));
          router.push(signInRoute);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline_destructive"
          className="w-full md:w-fit"
          disabled={isLoading}
        >
          <Loader loading={isLoading} icon={{ base: <Trash2 /> }} />
          Hapus Akun
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus Akun Anda
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN : Tindakan ini akan secara permanen menghapus semua data
            akun Anda. Harap berhati-hati karena aksi ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * --- ADMIN ---
 */

export function AdminCreateUserDialog() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser
    .pick({
      name: true,
      email: true,
      newPassword: true,
      confirmPassword: true,
      role: true,
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const Icon = UserRoundPlus;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const formHandler = ({ newPassword, ...rest }: z.infer<typeof schema>) => {
    setIsLoading(true);
    authClient.admin.createUser(
      { password: newPassword, ...rest },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(messages.success(`Akun ${rest.name}`, "created"));
          setIsLoading(false);
          form.reset();
          router.refresh();
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={isMobile ? "iconsm" : "sm"}>
          <Icon /> <span className="hidden md:flex">Tambah Pengguna</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>
            Isi detail pengguna baru dengan lengkap. Pastikan semua bidang wajib
            diisi.
          </DialogDescription>
        </DialogHeader>

        <Form form={form} onSubmit={formHandler}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => <Field field={field} {...userFields.name} />}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field field={field} {...userFields.email} />
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <Field field={field} {...userFields.newPassword} />
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <Field field={field} {...userFields.confirmPassword} />
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => <Field field={field} {...userFields.role} />}
          />

          <Separator />

          <DialogFooter>
            <DialogClose>{actions.cancel}</DialogClose>
            <Button type="submit" disabled={isLoading}>
              <Loader loading={isLoading} icon={{ base: <Icon /> }} />
              {actions.add}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AdminChangeUserRoleForm({
  data,
  setIsOpen,
}: {
  data: Session["user"];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser.pick({ role: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: data.role as Role },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    const newRole = formData.role as Role;
    if (newRole === data.role)
      return toast.info(messages.noChanges(`${data.name}'s role`));

    setIsLoading(true);
    authClient.admin.setRole(
      { userId: data.id, role: newRole },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(
            `Role ${data.name} berhasil diperbarui menjadi ${newRole}.`,
          );
          setIsLoading(false);
          setIsOpen(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <Form form={form} onSubmit={formHandler}>
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => <Field field={field} {...userFields.role} />}
      />

      <Button type="submit" disabled={isLoading}>
        <Loader loading={isLoading} icon={{ base: <Save /> }} />
        {actions.update}
      </Button>
    </Form>
  );
}

function AdminRevokeUserSessionsDialog({
  id,
  name,
}: Pick<Session["user"], "id" | "name">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    authClient.admin.revokeUserSessions(
      { userId: id },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(`Semua sesi aktif milik ${name} berhasil dicabut.`);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_warning" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <MonitorOff /> }} />
          {sharedText.revokeSession}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-warning flex items-center gap-x-2">
            <Info /> Cabut Semua Sesi Aktif untuk {name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan langsung menghentikan semua sesi aktif milik
            {name}. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "warning" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminRemoveUserDialog({
  data: { id, name, image },
  setIsOpen,
}: {
  data: Pick<Session["user"], "id" | "name" | "image">;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    if (image) await deleteProfilePicture(image);

    authClient.admin.removeUser(
      { userId: id },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(messages.success(name, "removed"));
          setIsLoading(false);
          setIsOpen(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_destructive" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <Trash2 /> }} />
          {`${actions.remove} ${name}`}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus Akun {name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN: Tindakan ini akaPn menghapus akun {name} beserta seluruh
            datanya secara permanen. Harap berhati-hati karena aksi ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminActionRevokeUserSessionsDialog({
  ids,
  onSuccess,
}: {
  ids: string[];
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    toast.promise(revokeUserSessions(ids), {
      loading: messages.loading,
      error: (e) => {
        setIsLoading(false);
        return e;
      },
      success: (res) => {
        setIsLoading(false);
        onSuccess();

        const successLength = res.filter(({ success }) => success).length;
        return `${successLength} dari ${ids.length} sesi pengguna berhasil dicabut.`;
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <MonitorOff /> }} />
          {sharedText.revokeSession}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            Cabut Sesi untuk {ids.length} Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ini akan menghentikan semua sesi aktif dari {ids.length} pengguna
            yang dipilih. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminActionRemoveUsersDialog({
  data,
  onSuccess,
}: {
  data: Pick<Session["user"], "id" | "name" | "image">[];
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    toast.promise(deleteUsers(data), {
      loading: messages.loading,
      error: (e) => {
        setIsLoading(false);
        return e;
      },
      success: (res) => {
        setIsLoading(false);
        onSuccess();

        router.refresh();

        const successLength = res.filter(({ success }) => success).length;
        return messages.success(
          `${successLength} dari ${data.length} akun pengguna`,
          "removed",
        );
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <Loader loading={isLoading} icon={{ base: <Trash2 /> }} />
          {actions.remove}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus {data.length} Akun
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN: Tindakan ini akan menghapus {data.length} akun yang
            dipilih beserta seluruh datanya secara permanen. Harap berhati-hati
            karena aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
