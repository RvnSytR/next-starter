"use client";

import { SignOutHandler } from "@/app/login/sign";
import { useIsMobile } from "@/hooks/use-mobile";
import { dialog, label, page } from "@/lib/content";
import { path } from "@/lib/menu";
import { zodChangePassword, zodUser } from "@/lib/zod";
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
  LogOut,
  Plus,
  RotateCw,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { userColumn } from "../custom/column";
import { CustomButton } from "../custom/custom-button";
import { type FacetedFilter, DataTable } from "../custom/data-table";
import { ToastAction } from "../custom/toast-action";
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

const { user: dialogUser } = dialog;
const { success } = label.toast;
const { button } = label;

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <CustomButton
      icon={<LogOut />}
      text={button.logout}
      variant="outline_destructive"
      loading={isLoading}
      onClick={() => {
        setIsLoading(true);
        toast.promise(SignOutHandler(), {
          loading: label.toast.loading.default,
          success: () => {
            router.push(path.login);
            return label.toast.success.logout;
          },
          error: (e: Error) => {
            setIsLoading(false);
            return e.message;
          },
        });
      }}
      inSidebar
    />
  );
}

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser.pick({ email: true, password: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
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
                <Input type="text" placeholder="Enter your Email" {...field} />
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
                  placeholder="Enter your Password"
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
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const schema = zodUser.pick({
    email: true,
    username: true,
    password: true,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
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
        <Button size={isMobile ? "default" : "sm"} variant="outline">
          <Plus />
          Create New User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogUser.create.title}</DialogTitle>
          <DialogDescription>{dialogUser.create.desc}</DialogDescription>
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
                      placeholder="Enter Username"
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
                    <Input type="email" placeholder="Enter Email" {...field} />
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
                      placeholder="Enter Password"
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
          <DialogTitle>{dialogUser.approve.title(username)}</DialogTitle>
          <DialogDescription>{dialogUser.approve.desc}</DialogDescription>
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
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dialogUser.delete.title(username)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialogUser.delete.desc}
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

export function ChangeProfileForm({ data }: { data: UserCredentials }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodUser.pick({
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
      <form onSubmit={form.handleSubmit(formHandler)} className="space-y-4">
        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled />
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
                  <Input
                    type="text"
                    placeholder="Enter your Username"
                    {...field}
                  />
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

export function ChangePasswordForm({ id_user }: { id_user: string }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof zodChangePassword>>({
    resolver: zodResolver(zodChangePassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formHandler = async (data: z.infer<typeof zodChangePassword>) => {
    setIsLoading(true);

    ToastAction(UpdateUserPassword(id_user, data), {
      success: () => {
        router.push(path.login);
        return success.user.update.password;
      },
      error: () => setIsLoading(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="space-y-4">
        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
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

export function UserDataTable({
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
      title={page.account.title}
      desc={page.account.subtitle}
      searchPlaceholder="Search User"
      withRefresh
    >
      <CreateUserDialog />
    </DataTable>
  );
}
