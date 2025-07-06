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
import { deleteProfilePicture } from "@/server/action";
import { getFilePublicUrl, uploadFiles } from "@/server/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithRole } from "better-auth/plugins";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  Ban,
  CircleFadingArrowUp,
  Dot,
  Gamepad2,
  Layers,
  LockKeyhole,
  LockKeyholeOpen,
  LogOut,
  Mail,
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
        toast.success(message.user.signOut);
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
                <AlertDialogTitle>
                  {dialog.profile.removeAvatar.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialog.profile.removeAvatar.desc}
                </AlertDialogDescription>
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
          {dialog.profile.deleteAccount.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert />
            {dialog.profile.deleteAccount.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.profile.deleteAccount.desc}
          </AlertDialogDescription>
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
      onRowSelection={(data) => {
        const ids = data.map(({ original }) => original.id);
        console.log(ids);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings2 />
                {buttonText.action}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-center">{`${ids.length} ${compText.selected}`}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* // TODO */}
              <DropdownMenuItem asChild>
                <Button size="sm" variant="ghost" disabled>
                  <Layers />
                  Impersonate Session
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Button size="sm" variant="ghost_destructive" disabled>
                  <Ban />
                  Ban
                </Button>
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
          <Icon /> {dialog.user.create.trigger}
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
                {dialog.user.create.trigger}
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
          {dialog.user.changeRole.trigger}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.user.changeRole.title(name)}</DialogTitle>
          <DialogDescription>
            {dialog.user.changeRole.desc(name)}
          </DialogDescription>
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
                {dialog.user.changeRole.trigger}
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

          {dialog.user.revokeSession.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            {dialog.user.revokeSession.title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.user.revokeSession.desc(name)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            {buttonText.cancel}
          </AlertDialogCancel>

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
          toast.success(message.success(`${name} account`, "removed"));
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
            {dialog.user.remove.title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.user.remove.desc(name)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })}>
            {buttonText.cancel}
          </AlertDialogCancel>

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
