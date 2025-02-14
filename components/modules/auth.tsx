"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";

import {
  ApproveUser,
  CheckUser,
  CreateUser,
  DeleteUser,
  UpdateUserPassword,
  UpdateUserProfile,
} from "@/server/action";
import { SignOutHandler } from "@/app/login/sign";
import type { Role, UserCredentials } from "@/server/db/schema";

import { type FacetedFilter, DataTable } from "../custom/data-table";
import { CustomButton } from "../custom/custom-button";
import { ToastAction } from "../custom/toast-action";
import { userColumn } from "../custom/column";
import { label } from "../content";
import { path } from "../menu";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CircleCheckBig, LogIn, Plus, Trash } from "lucide-react";

const { success, error } = label.toast;
const { button } = label;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginSchema = zodUserSchema.pick({ email: true, password: true });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = data;
    setIsLoading(true);

    ToastAction(CheckUser(email, password), {
      success: () => {
        router.push(path.protected);
        return success.login;
      },
      error: () => setIsLoading(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Masukkan Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Masukkan Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CustomButton
          customType={null}
          type="submit"
          load={isLoading}
          icon={<LogIn />}
          text={button.login}
          className="w-full"
        />
      </form>
    </Form>
  );
}

export function CreateUserDialog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const createSchema = zodUserSchema.pick({
    email: true,
    username: true,
    password: true,
  });

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof createSchema>) => {
    setIsLoading(true);

    ToastAction(CreateUser(data), {
      success: () => {
        setIsOpen(false);
        setIsLoading(false);
        router.refresh();
        return success.user.create;
      },
      error: () => setIsLoading(false),
    });
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <CustomButton
          customType={null}
          size="sm"
          variant="outline"
          icon={<Plus />}
          text="Tambah Pengguna"
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>
            Masukkan informasi yang diperlukan untuk menambah akun pengguna
            baru.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter className="gap-y-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Kembali
                </Button>
              </DialogClose>

              <CustomButton
                customType={null}
                type="submit"
                load={isLoading}
                text="Konfirmasi"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ApproveUserDialog({
  id_user,
  username,
  currentIdUser,
}: {
  id_user: string;
  username: string;
  currentIdUser: string;
}) {
  type UpdateRoles = Exclude<Role, "pending">;
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [role, setRole] = useState<UpdateRoles>("user");

  const handler = async () => {
    setIsDisable(true);
    ToastAction(ApproveUser(role, id_user), {
      success: () => {
        setIsDisable(false);
        return success.user.approve(username, role);
      },
      error: () => setIsDisable(false),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="iconsm" variant="outline_success" disabled={isDisable}>
            <CircleCheckBig />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setujui Registrasi {username}?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui registrasi {username}? Setelah
              disetujui, akun ini akan memiliki akses masuk dan tindakan ini
              tidak dapat dibatalkan. Harap pastikan keputusan Anda sebelum
              melanjutkan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full flex-col gap-y-2">
            <Label>Setujui Sebagai :</Label>

            <RadioGroup
              defaultValue="user"
              className="flex gap-x-2"
              onValueChange={(value) => setRole(value as UpdateRoles)}
            >
              <Label
                htmlFor="user"
                data-role={role}
                className="group data-[role=user]:border-foreground flex basis-1/2 items-center justify-center gap-x-2 rounded-md border p-2 hover:cursor-pointer"
              >
                <RadioGroupItem
                  id="user"
                  value="user"
                  className="border-foreground/50 group-data-[role=user]:border-foreground"
                />
                <p className="text-foreground/50 group-data-[role=user]:text-foreground font-semibold">
                  User
                </p>
              </Label>

              <Label
                htmlFor="admin"
                data-role={role}
                className="group data-[role=admin]:border-foreground flex basis-1/2 items-center justify-center gap-x-2 rounded-md border p-2 hover:cursor-pointer"
              >
                <RadioGroupItem
                  id="admin"
                  value="admin"
                  className="border-foreground/50 group-data-[role=admin]:border-foreground"
                />
                <p className="text-foreground/50 group-data-[role=admin]:text-foreground font-semibold">
                  Admin
                </p>
              </Label>
            </RadioGroup>
          </div>

          <Separator />

          <DialogFooter className="gap-y-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Kembali
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button onClick={handler}>Konfirmasi</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteUserDialog
        id_user={id_user}
        username={username}
        currentIdUser={currentIdUser}
      />
    </div>
  );
}

function DeleteUserDialog({
  username,
  id_user,
  currentIdUser,
}: {
  username: string;
  id_user: string;
  currentIdUser: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isCurrentUser = id_user === currentIdUser;
  if (isCurrentUser) return <Badge variant="outline">Current User</Badge>;

  const handler = async () => {
    setIsLoading(true);

    if (isCurrentUser) toast.info(error.user.delete);
    else {
      ToastAction(DeleteUser(id_user), {
        success: () => {
          setIsLoading(false);
          return success.user.delete(username);
        },
        error: () => setIsLoading(false),
      });
    }
  };

  return (
    <AlertDialog>
      <div className="flex justify-center">
        <AlertDialogTrigger asChild>
          <Button
            size="iconsm"
            variant="outline_destructive"
            disabled={isLoading}
          >
            <Trash />
          </Button>
        </AlertDialogTrigger>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {username} ?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus akun secara permanen dan tidak dapat
            dipulihkan. Pastikan Anda benar-benar yakin sebelum melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handler}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UpdateProfileForm({ data }: { data: UserCredentials }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUserSchema.pick({
    email: true,
    role: true,
    username: true,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: data.email,
      role: data.role,
      username: data.username,
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    const { username } = formData;

    ToastAction(UpdateUserProfile(data.id_user, username), {
      success: async () => {
        await SignOutHandler();
        router.push(path.login);
        return success.user.update.profile;
      },
      error: () => setIsLoading(false),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formHandler)}
        className="flex flex-col gap-y-2"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Status"
                    className="capitalize"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CustomButton
          customType={null}
          type="submit"
          load={isLoading}
          size="sm"
          className="md:w-fit"
          text="Simpan"
        />
      </form>
    </Form>
  );
}

export function UpdatePasswordForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmPass, setConfirmPass] = useState<string>("");
  const schema = zodUserSchema.pick({ password: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    const { password } = data;

    if (password !== confirmPass) toast.error("Password Tidak Sama!");
    else {
      setIsLoading(true);

      ToastAction(UpdateUserPassword(id, password), {
        success: async () => {
          await SignOutHandler();
          router.push(path.login);
          return success.user.update.password;
        },
        error: () => setIsLoading(false),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formHandler)}
        className="flex flex-col gap-y-2"
      >
        <div className="flex flex-col gap-x-2 gap-y-2 lg:flex-row">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Masukkan Password Baru"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="basis-1/2 space-y-1">
            <Label htmlFor="confirmPass">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPass"
              name="confirmPass"
              type="password"
              placeholder="Konfirmasi Password Baru"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
        </div>

        <CustomButton
          customType={null}
          type="submit"
          load={isLoading}
          size="sm"
          className="md:w-fit"
          text="Simpan"
        />
      </form>
    </Form>
  );
}

export function AccountDataTable({
  data,
  currentIdUser,
  facetedFilter,
}: {
  data: UserCredentials[];
  currentIdUser: string;
  facetedFilter?: FacetedFilter[];
}) {
  const columns: ColumnDef<UserCredentials>[] = [
    ...userColumn,
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const { id_user, username, role } = row.original;
        return (
          <div className="flex justify-center">
            {role === "pending" ? (
              <ApproveUserDialog
                id_user={id_user}
                username={username}
                currentIdUser={currentIdUser}
              />
            ) : (
              <DeleteUserDialog
                id_user={id_user}
                username={username}
                currentIdUser={currentIdUser}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      facetedFilter={facetedFilter}
      title="Data Pengguna"
      placeholder="Cari Pengguna"
      withRefresh
    >
      <CreateUserDialog />
    </DataTable>
  );
}
