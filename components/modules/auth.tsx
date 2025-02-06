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
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CircleCheckBig, LogIn, Plus, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const { loading, success, error } = label.toast;
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

    toast.promise(CheckUser(email, password), {
      loading: loading.default,
      success: () => {
        router.push(path.protected);
        return success.login;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formHandler)}
        className="flex flex-col gap-y-2"
      >
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
          className="mt-2"
        />
      </form>
    </Form>
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

    toast.promise(UpdateUserProfile(data.id_user, username), {
      loading: loading.default,
      success: async () => {
        await SignOutHandler();
        router.push("/login");
        return success.user.update.profile;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
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
          text={button.settings.user.updateProfile}
          className="md:w-fit"
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
      toast.promise(UpdateUserPassword(id, password), {
        loading: loading.default,
        success: async () => {
          await SignOutHandler();
          router.push("/login");
          return success.user.update.password;
        },
        error: (e: Error) => {
          setIsLoading(false);
          return e.message;
        },
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
          text={button.settings.user.updatePassword}
          className="md:w-fit"
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
    toast.promise(CreateUser(data), {
      loading: loading.default,
      success: () => {
        setIsOpen(false);
        setIsLoading(false);
        router.refresh();
        return success.user.create;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
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
          <DialogTitle>Tambah Admin</DialogTitle>
          <DialogDescription>
            Masukkan informasi yang diperlukan untuk menambah akun pengguna
            baru.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formHandler)}
            className="flex flex-col gap-y-2"
          >
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

            <Separator className="my-2" />

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

export function ApproveUserDialog({
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

  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-sky-50 dark:border-sky-700 dark:text-sky-700 dark:hover:bg-sky-700 dark:hover:text-sky-50"
            disabled={isDisable}
          >
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
            <span>Setujui Sebagai :</span>

            <RadioGroup
              defaultValue="user"
              className="flex gap-x-2"
              onValueChange={(value) => setRole(value as UpdateRoles)}
            >
              <Label
                htmlFor="user"
                data-role={role}
                className="group flex basis-1/2 items-center justify-center gap-x-2 rounded-md border p-4 hover:cursor-pointer data-[role=user]:border-foreground"
              >
                <RadioGroupItem
                  id="user"
                  value="user"
                  className="border-foreground/50 group-data-[role=user]:border-foreground"
                />
                <p className="font-semibold text-foreground/50 group-data-[role=user]:text-foreground">
                  User
                </p>
              </Label>

              <Label
                htmlFor="admin"
                data-role={role}
                className="group flex basis-1/2 items-center justify-center gap-x-2 rounded-md border p-4 hover:cursor-pointer data-[role=admin]:border-foreground"
              >
                <RadioGroupItem
                  id="admin"
                  value="admin"
                  className="border-foreground/50 group-data-[role=admin]:border-foreground"
                />
                <p className="font-semibold text-foreground/50 group-data-[role=admin]:text-foreground">
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
              <Button
                onClick={async () => {
                  setIsDisable(true);
                  toast.promise(ApproveUser(role, id_user), {
                    loading: loading.default,
                    success: () => {
                      setIsDisable(false);
                      return success.user.approve(username, role);
                    },
                    error: (e: Error) => {
                      setIsDisable(false);
                      return e.message;
                    },
                  });
                }}
              >
                Setujui Akun
              </Button>
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

export function DeleteUserDialog({
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

  return (
    <AlertDialog>
      <div className="flex justify-center">
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
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
            onClick={async () => {
              setIsLoading(true);
              if (isCurrentUser) {
                toast.info(error.user.delete);
              } else {
                toast.promise(DeleteUser(id_user), {
                  loading: loading.default,
                  success: () => {
                    setIsLoading(false);
                    return success.user.delete(username);
                  },
                  error: (e: Error) => {
                    setIsLoading(false);
                    return e.message;
                  },
                });
              }
            }}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
