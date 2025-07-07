"use client";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { dashboardRoute, mediaMeta, signInRoute } from "@/lib/const";
import {
  badgeText,
  buttonText,
  compText,
  dialog,
  message,
} from "@/lib/content";
import {
  adminRoles,
  allRoles,
  defaultRole,
  Role,
  rolesMeta,
  userRoles,
} from "@/lib/permission";
import { capitalize, cn } from "@/lib/utils";
import { zodAuth, zodFile } from "@/lib/zod";
import {
  deleteProfilePicture,
  deleteUsers,
  revokeUserSessions,
} from "@/server/action";
import { getFilePublicUrl, uploadFiles } from "@/server/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithRole } from "better-auth/plugins";
import {
  BadgeCheck,
  Ban,
  CircleFadingArrowUp,
  Dot,
  Gamepad2,
  LockKeyhole,
  LockKeyholeOpen,
  LogOut,
  Mail,
  Monitor,
  MonitorOff,
  MonitorSmartphone,
  RotateCcw,
  Save,
  Settings2,
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
import { z } from "zod/v4";
import { FormFloating } from "../custom/custom-field";
import { getUserColumn } from "../data-table/column";
import { DataTable, OtherDataTableProps } from "../data-table/data-table";
import { GithubIcon, Spinner } from "../other/icon";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { SidebarMenuButton } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function UserRoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  const isAdmin = adminRoles.includes(role);
  const { displayName, icon: RoleIcon, desc } = rolesMeta[role];
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge
          variant={isAdmin ? "outline_primary" : "outline"}
          className="capitalize"
        >
          <RoleIcon />
          {displayName ?? role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{desc}</TooltipContent>
    </Tooltip>
  );
}

export function UserVerifiedBadge({
  withoutText = false,
  className,
}: {
  withoutText?: boolean;
  className?: string;
}) {
  return (
    <Badge variant="outline_rvns" className={className}>
      <BadgeCheck /> {!withoutText && badgeText.verifiedUser}
    </Badge>
  );
}

export function UserAvatar({
  image,
  name,
  className,
  imageCn,
  fallbackCn,
}: Pick<Session["user"], "image" | "name"> & {
  className?: string;
  imageCn?: string;
  fallbackCn?: string;
}) {
  const fallbackName = name.slice(0, 2);
  return (
    <Avatar className={cn("rounded-xl", className)}>
      {image ? (
        <>
          <AvatarImage className={cn("rounded-xl", imageCn)} src={image} />
          <AvatarFallback className={cn("rounded-xl", fallbackCn)}>
            {fallbackName}
          </AvatarFallback>
        </>
      ) : (
        <span
          className={cn(
            "bg-muted flex size-full items-center justify-center transition-transform hover:scale-125",
            fallbackCn,
          )}
        >
          {fallbackName}
        </span>
      )}
    </Avatar>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      className="text-destructive hover:text-destructive"
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
              toast.success(message.user.signOut);
              router.push(signInRoute);
            },
          },
        });
      }}
    >
      {isLoading ? <Spinner /> : <LogOut />}
      {buttonText.signOut}
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
              toast.success(message.user.signIn());
            },
          },
        );
      }}
    >
      {isLoading ? <Spinner /> : <GithubIcon />}
      {buttonText.signOn("Github")}
    </Button>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodAuth.pick({
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
    authClient.signIn.email(formData, {
      onError: ({ error }) => {
        toast.error(error.message);
        setIsLoading(false);
      },
      onSuccess: () => {
        toast.success(message.user.signIn);
        router.push(signInRoute);
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
              <FormLabel className="label-required">Email Address</FormLabel>
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
              <FormLabel className="label-required">Password</FormLabel>
              <FormFloating icon={<LockKeyhole />}>
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
            <FormItem className="flex-row">
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

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner />}
          {buttonText.signIn}
        </Button>
      </form>
    </Form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodAuth
    .pick({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      isAgree: true,
    })
    .refine((sc) => sc.password === sc.confirmPassword, {
      message: message.user.confirmPassword,
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

  const formHandler = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    authClient.signUp.email(formData, {
      onError: ({ error }) => {
        toast.error(error.message);
        setIsLoading(false);
      },
      onSuccess: () => {
        toast.success(message.user.signUp);
        setIsLoading(false);
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">Username</FormLabel>
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
              <FormLabel className="label-required">Email Address</FormLabel>
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
              <FormLabel className="label-required">Password</FormLabel>
              <FormFloating icon={<LockKeyhole />}>
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
              <FormLabel className="label-required">Confirm Password</FormLabel>
              <FormFloating icon={<LockKeyhole />}>
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
                    I agree to the terms of service and privacy policy.
                  </small>
                </FormLabel>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner />}
          {buttonText.signUp}
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

  const contentType = "image";
  const { title, desc } = dialog.profile.removeAvatar;

  const schema = zodFile(contentType);

  const changeHandler = async (fileList: FileList) => {
    setIsChange(true);
    const files = Array.from(fileList).map((f) => f);

    const parseRes = schema.safeParse(files);
    if (!parseRes.success) return toast.error(parseRes.error.message);

    const file = files[0];
    const key = `${id}_${file.name}`;
    const url = await getFilePublicUrl(key);

    if (image && url !== image) await deleteProfilePicture(image);

    await uploadFiles({
      files: [{ key, file }],
      contentType,
      ACL: "public-read",
    });

    authClient.updateUser(
      { image: url },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsChange(false);
        },
        onSuccess: () => {
          toast.success(message.user.success("avatar", "updated"));
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
          toast.success(message.user.success("Avatar", "removed"));
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <UserAvatar name={name} image={image} className="size-20 md:size-24" />

      <input
        type="file"
        ref={inputAvatarRef}
        accept={mediaMeta[contentType].mimeType.join(", ")}
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
            {buttonText.upload("avatar")}
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
                {buttonText.remove}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{desc}</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => deleteHandler()}
                >
                  {buttonText.confirm}
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
  const schema = zodAuth.pick({ name: true, email: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: name, email: email },
  });

  const formHandler = ({ name: newName }: z.infer<typeof schema>) => {
    if (newName === name) return toast.info(message.user.noChanges("profile"));
    setIsLoading(true);
    authClient.updateUser(
      { name: newName },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(message.user.success("profile", "updated"));
          setIsLoading(false);
          router.refresh();
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Username</FormLabel>
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
        </CardContent>

        <CardFooter className="border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : <Save />}
            {buttonText.save}
          </Button>

          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {buttonText.reset}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = z
    .object({
      currentPassword: zodAuth.shape.password,
      newPassword: zodAuth.shape.password,
      confirmPassword: zodAuth.shape.confirmPassword,
      revokeOtherSessions: zodAuth.shape.revokeOtherSessions,
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: message.user.confirmPassword,
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
        toast.success(message.user.success("password", "updated"));
        setIsLoading(false);
        form.reset();
        router.refresh();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="gap-y-6">
        <CardContent className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">
                  Current Password
                </FormLabel>
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">New Password</FormLabel>
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">
                  Confirm Password
                </FormLabel>
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

          <FormField
            control={form.control}
            name="revokeOtherSessions"
            render={({ field }) => (
              <FormItem className="flex-row">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Sign out from other devices</FormLabel>
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter className="border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : <Save />}
            {buttonText.save}
          </Button>

          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {buttonText.reset}
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isCurrentSession = currentSessionId === id;
  const parsedResult = new UAParser(userAgent!).getResult();

  const { browser, os, device } = parsedResult;
  const { title, desc } = dialog.profile.revokeSession;
  const { currentSession, browserAndOS, lastSeen } = message.user;

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
          toast.success(message.user.revokeThisSession);
          setIsLoading(false);
          router.refresh();
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
          <small className="font-medium">
            {browserAndOS(browser.name, os.name)}
          </small>

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
                {currentSession}
              </small>
            ) : (
              <small className="order-3 line-clamp-1 font-normal">
                {lastSeen(updatedAt)}
              </small>
            )}
          </div>
        </div>
      </div>

      {!isCurrentSession && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="iconsm" variant="outline" disabled={isLoading}>
              {isLoading ? <Spinner /> : <LogOut />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{desc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={clickHandler}>
                {buttonText.confirm}
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

  const { trigger, title, desc } = dialog.profile.revokeAllOtherSession;

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeOtherSessions({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(message.user.revokeOtherSessions);
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
          {isLoading ? <Spinner /> : <MonitorOff />}
          {trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>
            {buttonText.confirm}
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

  const { trigger, title, desc } = dialog.profile.deleteAccount;

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
          toast.success(message.user.success("account", "removed"));
          router.push(signInRoute);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_destructive" disabled={isLoading}>
          {isLoading ? <Spinner /> : <Trash2 />}
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * --- ADMIN ---
 */

export function AdminAccountDataTable({
  data,
  currentUserId,
  ...props
}: OtherDataTableProps<UserWithRole> & {
  data: UserWithRole[];
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
                <Settings2 />
                {buttonText.action}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-center">{`${filteredData.length} ${compText.selected}`}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <AdminActionTerminateUserSessionsDialog
                  ids={filteredData.map(({ id }) => id)}
                  onSuccess={clearRowSelection}
                />
              </DropdownMenuItem>

              {/* // TODO */}
              <DropdownMenuItem asChild>
                <Button size="sm" variant="ghost_destructive" disabled>
                  <Ban />
                  Ban
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

export function AdminCreateUserDialog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const Icon = UserRoundPlus;
  const { trigger, title, desc } = dialog.user.create;

  const schema = zodAuth
    .pick({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true,
    })
    .refine((sc) => sc.password === sc.confirmPassword, {
      message: message.user.confirmPassword,
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

  const formHandler = (formData: z.infer<typeof schema>) => {
    const { role, ...restData } = formData;
    setIsLoading(true);
    authClient.admin.createUser(
      { role: role as Role, ...restData },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(message.success(`${formData.name} account`, "created"));
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
        <Button size="sm">
          <Icon /> {trigger}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-required">Username</FormLabel>
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
                  <FormLabel className="label-required">
                    Email Address
                  </FormLabel>
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
                  <FormLabel className="label-required">Password</FormLabel>
                  <FormFloating icon={<LockKeyhole />}>
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
                  <FormLabel className="label-required">
                    Confirm Password
                  </FormLabel>
                  <FormFloating icon={<LockKeyhole />}>
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
                <FormItem>
                  <FormLabel className="label-required">Role</FormLabel>
                  <Select
                    value={field.value as Role}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {allRoles.map((item, index) => {
                        const { displayName, icon: RoleIcon } = rolesMeta[item];
                        return (
                          <SelectItem
                            key={index}
                            value={item}
                            className="capitalize"
                          >
                            <RoleIcon />
                            {displayName ?? capitalize(item)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter>
              <DialogClose>{buttonText.cancel}</DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : <Icon />}
                {trigger}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminChangeUserRoleDialog({ id, name, role }: UserWithRole) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const schema = zodAuth.pick({ role: true });
  const { trigger, title, desc } = dialog.user.changeRole;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: role ?? defaultRole },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);

    const newRole = formData.role as Role;
    if (newRole === role) return toast.info(message.noChanges(`${name} role`));

    authClient.admin.setRole(
      { userId: id, role: newRole },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(message.user.changeRole(name, newRole));
          setIsLoading(false);
          setIsOpen(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isLoading}>
          {isLoading ? <Spinner /> : <CircleFadingArrowUp />}
          {trigger}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title(name)}</DialogTitle>
          <DialogDescription>{desc(name)}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-required">Role</FormLabel>
                  <Select
                    value={field.value as Role}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {allRoles.map((item, index) => {
                        const { displayName, icon: RoleIcon } = rolesMeta[item];
                        return (
                          <SelectItem
                            key={index}
                            value={item}
                            className="capitalize"
                          >
                            <RoleIcon />
                            {displayName ?? capitalize(item)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter>
              <DialogClose>{buttonText.cancel}</DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : <CircleFadingArrowUp />}
                {trigger}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminTerminateUserSessionsDialog({
  id,
  name,
}: Pick<Session["user"], "id" | "name">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { trigger, title, desc } = dialog.user.revokeSessions;

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
          toast.success(message.user.revokeUserSession(name));
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          {isLoading ? <Spinner /> : <MonitorOff />}
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            {title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc(name)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AdminRemoveUserDialog({
  id,
  name,
  image,
}: Pick<Session["user"], "id" | "name" | "image">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { title, desc } = dialog.user.remove;

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
          toast.success(message.success(name, "removed"));
          setIsLoading(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          {isLoading ? <Spinner /> : <Trash2 />}
          {buttonText.remove}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <TriangleAlert />
            {title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc(name)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminActionTerminateUserSessionsDialog({
  ids,
  onSuccess,
}: {
  ids: string[];
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { trigger, title, desc } = dialog.user.revokeMultipleSessions;

  const clickHandler = async () => {
    setIsLoading(true);
    toast.promise(revokeUserSessions(ids), {
      loading: message.loading,
      error: (e) => {
        setIsLoading(false);
        return e;
      },
      success: () => {
        setIsLoading(false);
        onSuccess();
        return message.user.revokeUserSession();
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          {isLoading ? <Spinner /> : <MonitorOff />}
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            {title(ids.length)}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc(ids.length)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
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

  const { title, desc } = dialog.user.removeMultiple;

  const clickHandler = async () => {
    setIsLoading(true);
    toast.promise(deleteUsers(data), {
      loading: message.loading,
      error: (e) => {
        setIsLoading(false);
        return e;
      },
      success: (res) => {
        setIsLoading(false);
        onSuccess();

        router.refresh();

        const successLength = res.filter(({ success }) => success).length;
        return message.user.removeUsers(successLength, data.length);
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          {isLoading ? <Spinner /> : <Trash2 />}
          {buttonText.remove}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> {title(data.length)}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc(data.length)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
