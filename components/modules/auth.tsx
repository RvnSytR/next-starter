"use client";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { dialog, label } from "@/lib/content";
import { media } from "@/lib/media";
import { route } from "@/lib/menu";
import { adminRoles, roleIcon, userRoles } from "@/lib/role";
import { capitalize, cn } from "@/lib/utils";
import { zodAuth, zodFile } from "@/lib/zod";
import { deleteProfilePicture } from "@/server/auth-action";
import { getFilePublicUrl, uploadFile } from "@/server/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithRole } from "better-auth/plugins";
import { formatDistanceToNow } from "date-fns";
import {
  CircleFadingArrowUp,
  Dot,
  EllipsisVertical,
  Gamepad2,
  KeyRound,
  LockKeyhole,
  LockKeyholeOpen,
  LogOut,
  Mail,
  MonitorOff,
  MonitorSmartphone,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  TriangleAlert,
  TvMinimal,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { z } from "zod";
import { FormFloating, InputRadioGroup } from "../custom/custom-field";
import { CustomIcon, Spinner } from "../custom/custom-icon";
import { userColumn, userColumnHelper } from "../data-table/column";
import { DataTable, OtherDataTableProps } from "../data-table/data-table";
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
import { Checkbox } from "../ui/checkbox";
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
import { Separator } from "../ui/separator";
import { SidebarMenuButton } from "../ui/sidebar";

export function UserAvatar({
  image,
  name,
  className,
}: Pick<Session["user"], "image" | "name"> & { className?: string }) {
  const fallbackName = name.slice(0, 2);

  return (
    <Avatar className={className}>
      {image ? (
        <>
          <AvatarImage className="rounded-md object-cover" src={image} />
          <AvatarFallback className="rounded-md">{fallbackName}</AvatarFallback>
        </>
      ) : (
        <span className="bg-muted flex size-full items-center justify-center">
          {fallbackName}
        </span>
      )}
    </Avatar>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      size="sm"
      className="text-destructive hover:text-destructive"
      disabled={loading}
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onRequest: () => setLoading(true),
            onSuccess: () => {
              toast.success(label.toast.success.user.signOut);
              router.push(route.auth);
            },
            onError: ({ error }) => {
              setLoading(false);
              toast.error(error.message);
            },
          },
        })
      }
    >
      {loading ? <Spinner /> : <LogOut />}
      {label.button.signOut}
    </SidebarMenuButton>
  );
}

export function SignOnGithubButton() {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await authClient.signIn.social({
          provider: "github",
          callbackURL: route.protected,
          errorCallbackURL: route.auth,
        });
      }}
    >
      {loading ? <Spinner /> : <CustomIcon customType="github" />}
      {label.button.signOn("Github")}
    </Button>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = zodAuth.pick({
    email: true,
    password: true,
    rememberMe: true,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    await authClient.signIn.email(formData, {
      onRequest: () => setLoading(true),
      onSuccess: ({ data }) => {
        toast.success(label.toast.success.user.signIn(data?.user.name));
        router.push(route.protected);
      },
      onError: ({ error }) => {
        setLoading(false);
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormFloating icon={<Mail />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your Email Address"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
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
              <FormFloating icon={<KeyRound />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex-row gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Remember me</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {label.button.signIn}
        </Button>
      </form>
    </Form>
  );
}

export function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);

  const schema = zodAuth
    .pick({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      isAgree: true,
    })
    .refine((sc) => sc.password === sc.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgree: false,
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    await authClient.signUp.email(formData, {
      onRequest: () => setLoading(true),
      onSuccess: () => {
        form.reset();
        toast.success(label.toast.success.user.signUp);
      },
      onError: ({ error }) => {
        toast.error(error.message);
      },
    });
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username *</FormLabel>
              <FormFloating icon={<UserRound />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your Username"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormFloating icon={<Mail />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your Email Address"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
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
              <FormFloating icon={<KeyRound />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password *</FormLabel>
              <FormFloating icon={<KeyRound />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your Password"
                    {...field}
                  />
                </FormControl>
              </FormFloating>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAgree"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="flex flex-col items-start gap-y-1">
                  <span>Accept terms and conditions</span>
                  <small className="text-muted-foreground text-xs font-normal">
                    I agree to the Terms of Service and Privacy Policy.
                  </small>
                </FormLabel>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {label.button.signUp}
        </Button>
      </form>
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

  const schema = zodFile("image");

  const changeHandler = async (fileList: FileList) => {
    const parseRes = schema.safeParse(Array.from(fileList).map((file) => file));
    if (!parseRes.success) return toast.error(parseRes.error.errors[0].message);

    setIsChange(true);

    const formData = new FormData();
    const file = fileList[0];
    const fileKey = `${id}_${file.name}`;
    const fileUrl = await getFilePublicUrl(fileKey);

    formData.append(fileKey, file);
    if (fileUrl !== image) await deleteProfilePicture(image);

    await uploadFile({
      formData: formData,
      names: [fileKey],
      nameAskey: true,
      ACL: "public-read",
    });
    await authClient.updateUser(
      { image: fileUrl },
      {
        onSuccess: () => {
          toast.success(label.toast.success.profile.update("avatar"));
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );

    setIsChange(false);
  };

  const deleteHandler = async () => {
    setIsRemoved(true);

    await deleteProfilePicture(image);
    await authClient.updateUser(
      { image: null },
      {
        onSuccess: () => {
          toast.success(label.toast.success.profile.update("avatar"));
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );

    setIsRemoved(false);
  };

  return (
    <div className="flex items-center gap-x-4">
      <UserAvatar name={name} image={image} className="size-24" />

      <input
        type="file"
        ref={inputAvatarRef}
        accept={media.image.type.join(", ")}
        className="hidden"
        onChange={(e) => {
          const fileList = e.currentTarget.files;
          if (fileList) changeHandler(fileList);
        }}
      />

      <div className="flex flex-col gap-y-2">
        <Label>Profile Picture</Label>
        <div className="flex gap-x-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isChange || isRemoved}
            onClick={() => inputAvatarRef.current?.click()}
          >
            {isChange && <Spinner />}
            Upload Avatar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline_destructive"
                disabled={!image || isChange || isRemoved}
              >
                {isRemoved && <Spinner />}
                {isRemoved ? "Removing..." : "Remove"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {dialog.profile.removeAvatar.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialog.profile.removeAvatar.desc}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  className={buttonVariants({ variant: "outline" })}
                >
                  {label.button.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => deleteHandler()}
                >
                  {label.button.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function PersonalInformation({
  ...props
}: Pick<Session["user"], "id" | "name" | "email" | "image" | "role">) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const { name, email, role } = props;
  const schema = zodAuth
    .pick({ name: true, email: true, role: true })
    .refine((sc) => sc.email === email, {
      message: "Invalid email",
      path: ["email"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
      email: email,
      role: role ? capitalize(role) : null,
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    const newName = formData.name;
    if (newName === name) return toast.info(label.toast.info.profile);

    await authClient.updateUser(
      { name: newName },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          toast.success(label.toast.success.profile.update("profile"));
          router.refresh();
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="gap-y-6">
        <CardContent className="flex flex-col gap-y-4">
          <ProfilePicture {...props} />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormFloating icon={<UserRound />}>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your Name"
                      {...field}
                    />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormFloating icon={<Mail />}>
                  <FormControl>
                    <Input type="text" disabled {...field} />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field: { value, ...restField } }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormFloating icon={<LockKeyholeOpen />}>
                  <FormControl>
                    <Input
                      type="text"
                      value={value ?? undefined}
                      disabled
                      {...restField}
                    />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <Separator />

        <CardFooter className="gap-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : <Save />}
            {label.button.save}
          </Button>

          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {label.button.reset}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = z
    .object({
      current: zodAuth.shape.password,
      new: zodAuth.shape.password,
      confirm: zodAuth.shape.confirmPassword,
    })
    .refine((sc) => sc.new === sc.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { current: "", new: "", confirm: "" },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    await authClient.changePassword(
      {
        currentPassword: formData.current,
        newPassword: formData.new,
        revokeOtherSessions: true,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          form.reset();
          toast.success(label.toast.success.profile.update("password"));
          router.refresh();
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="gap-y-6">
        <CardContent className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="current"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password *</FormLabel>
                <FormFloating icon={<LockKeyholeOpen />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      {...field}
                    />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password *</FormLabel>
                <FormFloating icon={<LockKeyhole />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password *</FormLabel>
                <FormFloating icon={<LockKeyhole />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <Separator />

        <CardFooter className="gap-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : <Save />}
            {label.button.save}
          </Button>

          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {label.button.reset}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export function ActiveSessionButton({
  currentSessionId,
  id,
  updatedAt,
  ipAddress,
  userAgent,
  token,
}: Session["session"] & { currentSessionId: string }) {
  const router = useRouter();
  const isCurrentSession = currentSessionId === id;
  const { title, desc } = dialog.profile.revokeSession;

  const parseResult = new UAParser(userAgent!).getResult();
  const { browser, os, device } = parseResult;

  const DeviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    console: Gamepad2,
    smarttv: TvMinimal,
    wearable: MonitorSmartphone,
    xr: MonitorSmartphone,
    embedded: MonitorSmartphone,
    other: MonitorSmartphone,
  }[device.type ?? "other"];

  const revokeSession = async () => {
    await authClient.revokeSession(
      { token },
      {
        onSuccess: () => {
          toast.success(label.toast.success.profile.revokeSession);
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="bg-card flex items-center gap-x-2 rounded-lg border p-2 shadow-xs">
      <div className="flex grow items-center gap-x-2">
        <div className="bg-muted aspect-square size-fit rounded-lg p-2">
          <DeviceIcons className="shrink-0" />
        </div>

        <div className="flex flex-col">
          <small className="font-medium">{`${browser.name} on ${os.name}`}</small>

          <div className="text-muted-foreground flex items-center">
            <small
              className={cn(
                "font-normal",
                isCurrentSession ? "order-3" : "order-1",
              )}
            >
              {ipAddress}
            </small>

            <Dot className="order-2 shrink-0" />

            {isCurrentSession ? (
              <small className="text-success order-1 font-medium">
                Current Session
              </small>
            ) : (
              <small className="order-3 line-clamp-1 font-normal">
                Last seen {formatDistanceToNow(updatedAt)} ago
              </small>
            )}
          </div>
        </div>
      </div>

      {!isCurrentSession && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="iconsm" variant="outline">
              <LogOut />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{desc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => revokeSession()}>
                {label.button.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function RevokeAllOtherSessionButton() {
  const router = useRouter();
  const { trigger, title, desc } = dialog.profile.revokeAllOtherSession;

  const revokeAllOtherSession = async () => {
    await authClient.revokeOtherSessions(
      {},
      {
        onSuccess: () => {
          toast.success(label.toast.success.profile.revokeAllOtherSession);
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <MonitorOff />
          {trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => revokeAllOtherSession()}>
            {label.button.confirm}
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
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_destructive">
          <Trash2 />
          {dialog.profile.deleteAccount.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <TriangleAlert />
            {dialog.profile.deleteAccount.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.profile.deleteAccount.desc}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            {label.button.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={async () => {
              await deleteProfilePicture(image);
              await authClient.deleteUser(
                { callbackURL: route.auth },
                {
                  onSuccess: () => {
                    toast.success(label.toast.success.profile.deleteAccount);
                    router.push(route.auth);
                  },
                  onError: ({ error }) => {
                    toast.error(error.message);
                  },
                },
              );
            }}
          >
            {label.button.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AdminAccountDataTable({
  data,
  currentUser,
  ...props
}: OtherDataTableProps & {
  data: UserWithRole[];
  currentUser: Session["user"];
}) {
  const dataColumn = [
    ...userColumn,
    userColumnHelper.display({
      id: "Action",
      header: "Action",
      cell: ({ row }) => {
        if (row.original.id === currentUser.id) {
          return <Badge variant="outline">Current User</Badge>;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="iconsm" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col gap-y-0.5">
              <DropdownMenuLabel className="text-center">
                {row.original.name}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <AdminChangeUserRoleDialog {...row.original} />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <AdminRemoveUserDialog {...row.original} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  return <DataTable data={data} columns={dataColumn} {...props} />;
}

export function AdminCreateUserDialog() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = zodAuth
    .pick({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true,
    })
    .refine((sc) => sc.password === sc.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: userRoles[0],
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    const { role, ...restData } = formData;
    await authClient.admin.createUser(
      { role: role ?? userRoles[0], ...restData },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          form.reset();
          toast.success(label.toast.success.user.create(formData.name));
          router.refresh();
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserRoundPlus />
          {dialog.user.create.trigger}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.user.create.title}</DialogTitle>
          <DialogDescription>{dialog.user.create.desc}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormFloating icon={<UserRound />}>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Username"
                        {...field}
                      />
                    </FormControl>
                  </FormFloating>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormFloating icon={<Mail />}>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Email Address"
                        {...field}
                      />
                    </FormControl>
                  </FormFloating>
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
                  <FormFloating icon={<KeyRound />}>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                      />
                    </FormControl>
                  </FormFloating>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormFloating icon={<KeyRound />}>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your Password"
                        {...field}
                      />
                    </FormControl>
                  </FormFloating>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Role *</FormLabel>
                  <InputRadioGroup
                    defaultValue={field.value ?? userRoles[0]}
                    onValueChange={field.onChange}
                    className="flex gap-x-2"
                    radioItems={[...userRoles, ...adminRoles].map((item) => {
                      const Icon = roleIcon[item];
                      return {
                        icon: <Icon />,
                        value: item,
                        className: "capitalize",
                      };
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter className="gap-y-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {label.button.cancel}
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : <UserRoundPlus />}
                {dialog.user.create.trigger}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminRemoveUserDialog({
  id,
  name,
  image,
}: Pick<Session["user"], "id" | "name" | "image">) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost_destructive"
          className="justify-start"
          disabled={loading}
        >
          {loading ? <Spinner /> : <Trash2 />}
          {dialog.user.remove.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <TriangleAlert />
            {dialog.user.remove.title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.user.remove.desc(name)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            {label.button.cancel}
          </AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={async () => {
              setLoading(true);

              await deleteProfilePicture(image);
              await authClient.admin.removeUser(
                { userId: id },
                {
                  onSuccess: () => {
                    toast.success(label.toast.success.user.remove(name));
                    router.refresh();
                  },
                  onError: ({ error }) => {
                    setLoading(false);
                    toast.error(error.message);
                  },
                },
              );
            }}
          >
            {label.button.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AdminChangeUserRoleDialog({
  id,
  name,
  role,
}: Pick<Session["user"], "id" | "name" | "role">) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = zodAuth.pick({ role: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: role },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    const newRole = formData.role ?? userRoles[0];
    if (newRole === role) return toast.info(label.toast.info.changeRole(name));

    await authClient.admin.setRole(
      { userId: id, role: newRole },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          toast.success(label.toast.success.user.changeRole(name, newRole));
          router.refresh();
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="justify-start"
          disabled={loading}
        >
          {loading ? <Spinner /> : <CircleFadingArrowUp />}
          {dialog.user.changeRole.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dialog.user.changeRole.title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.user.changeRole.desc(name)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Change To</FormLabel>
                  <InputRadioGroup
                    defaultValue={field.value ?? userRoles[0]}
                    onValueChange={field.onChange}
                    className="flex gap-x-2"
                    radioItems={[...userRoles, ...adminRoles].map((item) => {
                      const Icon = roleIcon[item];
                      return {
                        icon: <Icon />,
                        value: item,
                        className: "capitalize",
                      };
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="gap-y-2">
              <AlertDialogCancel
                className={buttonVariants({ variant: "outline" })}
              >
                {label.button.cancel}
              </AlertDialogCancel>

              <AlertDialogAction type="submit" disabled={loading}>
                {loading ? <Spinner /> : <CircleFadingArrowUp />}
                {dialog.user.changeRole.trigger}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
