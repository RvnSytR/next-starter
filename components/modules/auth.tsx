"use client";

import { SignOutHandler } from "@/app/login/sign";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodUserSchema } from "@/lib/zod";
import {
  ApproveUser,
  CheckUser,
  CreateUser,
  DeleteUser,
  UpdateUserPassword,
  UpdateUserProfile,
} from "@/server/action";
import type { Role, UserCredentials } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckBig,
  EllipsisVertical,
  LogIn,
  Plus,
  RotateCw,
  Save,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { label } from "../content";
import { userColumn } from "../custom/column";
import { CustomButton } from "../custom/custom-button";
import { type FacetedFilter, DataTable } from "../custom/data-table";
import { ToastAction } from "../custom/toast-action";
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
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";

const { success } = label.toast;
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
          type="submit"
          loading={isLoading}
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
        <Button size="sm" variant="outline">
          <Plus />
          Create New User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Enter the information required to add a new user.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)} className="space-y-4">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
                  {button.back}
                </Button>
              </DialogClose>

              <CustomButton
                type="submit"
                loading={isLoading}
                text={button.confirm}
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
}: {
  id_user: string;
  username: string;
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost_success"
          className="grow justify-start"
          disabled={isDisable}
        >
          <CircleCheckBig /> Approve
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve {username} Registration?</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve {username} registration? Once
            approved, this user will have login access and this action cannot be
            undone. Please confirm your decision before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-y-4">
          <Label>Approve As :</Label>

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

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {button.back}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handler}>{button.confirm}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({
  username,
  id_user,
}: {
  username: string;
  id_user: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handler = async () => {
    setIsLoading(true);
    ToastAction(DeleteUser(id_user), {
      success: () => {
        setIsLoading(false);
        return success.user.delete(username);
      },
      error: () => setIsLoading(false),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost_destructive"
          className="grow justify-start"
          disabled={isLoading}
        >
          <Trash /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {username} ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this account and cannot be
            restored. Please confirm your decision before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{button.back}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handler}
          >
            {button.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UpdateProfileForm({ data }: { data: UserCredentials }) {
  const router = useRouter();
  const isMobile = useIsMobile();
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
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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

        <div className="flex gap-2">
          <CustomButton
            type="submit"
            loading={isLoading}
            size={isMobile ? "default" : "sm"}
            icon={<Save />}
            text={button.save}
          />

          <Button
            type="button"
            size={isMobile ? "default" : "sm"}
            variant="outline"
            onClick={() => form.reset()}
          >
            <RotateCw />
            {button.reset}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function UpdatePasswordForm({ id }: { id: string }) {
  const router = useRouter();
  const isMobile = useIsMobile();
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
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
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
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <CustomButton
            type="submit"
            loading={isLoading}
            size={isMobile ? "default" : "sm"}
            icon={<Save />}
            text={button.save}
          />

          <Button
            type="button"
            size={isMobile ? "default" : "sm"}
            variant="outline"
            onClick={() => {
              form.reset();
              setConfirmPass("");
            }}
          >
            <RotateCw />
            {button.reset}
          </Button>
        </div>
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
      header: "Action",
      cell: ({ row }) => {
        const { id_user, username, role } = row.original;

        const isCurrentUser = id_user === currentIdUser;
        if (isCurrentUser) return <Badge variant="outline">Current User</Badge>;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="iconsm" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {role === "pending" && (
                <DropdownMenuItem asChild>
                  <ApproveUserDialog id_user={id_user} username={username} />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <DeleteUserDialog id_user={id_user} username={username} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      facetedFilter={facetedFilter}
      title="Users Overview"
      desc="A comprehensive overview of all registered users, providing their essential details and management actions."
      placeholder="Search User"
      withRefresh
    >
      <CreateUserDialog />
    </DataTable>
  );
}
