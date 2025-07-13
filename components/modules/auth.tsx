"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { dashboardRoute, mediaMeta, signInRoute } from "@/lib/const";
import { buttonText, commonText, content, messages } from "@/lib/content";
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
  redirectAction,
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
  Info,
  Layers2,
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
import { SectionSheetDetails } from "../layout/section";
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

const contentAuth = content.auth;
const formItem = contentAuth.formItem;
const dialogs = contentAuth.dialogs;

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
  classNames,
}: {
  withoutText?: boolean;
  className?: string;
  classNames?: { tooltip?: string; icon?: string };
}) {
  if (withoutText) {
    return (
      <BadgeCheck
        className={cn("text-rvns size-4 shrink-0", classNames?.icon)}
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge variant="outline_rvns" className={cn("capitalize", className)}>
          <BadgeCheck className={classNames?.icon} />
          {commonText.verified}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{contentAuth.verified}</TooltipContent>
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
  const fallbackName = name.slice(0, 2);
  return (
    <Avatar className={cn("rounded-xl", className)}>
      {image ? (
        <>
          <AvatarImage
            className={cn("rounded-xl", classNames?.image)}
            src={image}
          />
          <AvatarFallback className={cn("rounded-xl", classNames?.fallback)}>
            {fallbackName}
          </AvatarFallback>
        </>
      ) : (
        <span
          className={cn(
            "bg-muted flex size-full items-center justify-center transition-transform hover:scale-125",
            classNames?.fallback,
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
              toast.success(contentAuth.signOut);
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
              toast.success(contentAuth.signIn());
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        toast.success(contentAuth.signIn);
        setIsAuthenticated(true);
      },
    });
  };

  if (isAuthenticated) redirectAction(signInRoute);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">
                {formItem.email.label}
              </FormLabel>
              <FormFloating icon={<Mail />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={formItem.email.placeholder}
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
              <FormLabel className="label-required">
                {formItem.password.label}
              </FormLabel>
              <FormFloating icon={<LockKeyhole />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={formItem.password.placeholder}
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
              <FormLabel>{formItem.rememberMe}</FormLabel>
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
      message: contentAuth.confirmPassword,
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
        toast.success(contentAuth.signUp);
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
              <FormLabel className="label-required">
                {formItem.username.label}
              </FormLabel>
              <FormFloating icon={<UserRound />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={formItem.username.placeholder}
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
                {formItem.email.label}
              </FormLabel>
              <FormFloating icon={<Mail />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={formItem.email.placeholder}
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
              <FormLabel className="label-required">
                {formItem.password.label}
              </FormLabel>
              <FormFloating icon={<LockKeyhole />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={formItem.password.placeholder}
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
                {formItem.confirmPassword.label}
              </FormLabel>
              <FormFloating icon={<LockKeyhole />}>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={formItem.confirmPassword.placeholder}
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
              <div className="flex gap-x-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <div className="flex flex-col items-start gap-y-1.5">
                  <FormLabel>{formItem.agreement.label}</FormLabel>
                  <small className="text-muted-foreground text-xs font-normal">
                    {formItem.agreement.placeholder}
                  </small>
                </div>
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
  const { title, desc } = dialogs.removeAvatar;

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
          toast.success(contentAuth.success("avatar", "updated"));
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
          toast.success(contentAuth.success("avatar", "removed"));
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
        <Label>{formItem.profilePic}</Label>
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
    if (newName === name) return toast.info(contentAuth.noChanges("profile"));
    setIsLoading(true);
    authClient.updateUser(
      { name: newName },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(contentAuth.success("profile", "updated"));
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
                <FormLabel>{formItem.email.label}</FormLabel>
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
                <FormLabel className="label-required">
                  {formItem.username.label}
                </FormLabel>
                <FormFloating icon={<UserRound />}>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={formItem.username.placeholder}
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
      message: contentAuth.confirmPassword,
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
        toast.success(contentAuth.success("password", "updated"));
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
                  {formItem.currentPassword.label}
                </FormLabel>
                <FormFloating icon={<LockKeyholeOpen />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={formItem.currentPassword.placeholder}
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
                <FormLabel className="label-required">
                  {formItem.newPassword.label}
                </FormLabel>
                <FormFloating icon={<LockKeyhole />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={formItem.newPassword.placeholder}
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
                  {formItem.confirmPassword.label}
                </FormLabel>
                <FormFloating icon={<LockKeyhole />}>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={formItem.confirmPassword.placeholder}
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

  const { title, desc, success } = dialogs.revokeSession;
  const { browser, os, device } = parsedResult;
  const { current, lastSeen } = contentAuth;

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
          toast.success(success);
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
            {messages.browserOnOS(browser.name, os.name)}
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
                {current("session")}
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

  const { trigger, title, desc, success } = dialogs.revokeAllOtherSession;

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeOtherSessions({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(success);
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

  const { trigger, title, desc } = dialogs.delete;

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
          toast.success(contentAuth.success("account", "removed"));
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
 * --- USER ---
 */

export function UserDetailSheet({ data }: { data: UserWithRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const { title, desc } = contentAuth.detail;
  const details = [
    { label: "User ID", content: `${data.id.slice(0, 19)}...` },
    { label: "Email Address", content: data.email },
    { label: "Created At", content: contentAuth.createdAgo(data.createdAt) },
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
            <SheetTitle className="text-base">{title(data.name)}</SheetTitle>
            <SheetDescription>{desc(data.name)}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-y-2 px-4">
          <Separator className="my-2" />

          <div className="flex items-start gap-x-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <UserRoleBadge role={data.role as Role} />
                {data.emailVerified && <UserVerifiedBadge />}
              </div>

              <SectionSheetDetails data={details} />
            </div>
          </div>

          <Separator className="my-2" />

          <AdminChangeUserRoleForm data={data} setIsOpen={setIsOpen} />

          <Separator className="my-2" />

          {/* // TODO */}
          <Button variant="outline_primary" disabled>
            <Layers2 />
            Impersonate Session
          </Button>

          <AdminRevokeUserSessionsDialog {...data} />

          {/* // TODO */}
          <Button variant="outline_destructive" disabled>
            <Ban />
            Ban {data.name}
          </Button>
        </div>

        <SheetFooter>
          <AdminRemoveUserDialog data={data} setIsOpen={setIsOpen} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserDataTable({
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
              <DropdownMenuLabel className="text-center">{`${filteredData.length} ${commonText.selected}`}</DropdownMenuLabel>

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

/*
 * --- ADMIN ACTION ---
 */

export function AdminCreateUserDialog() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const Icon = UserRoundPlus;
  const { trigger, title, desc } = dialogs.adminCreate;

  const schema = zodAuth
    .pick({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true,
    })
    .refine((sc) => sc.password === sc.confirmPassword, {
      message: contentAuth.confirmPassword,
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
          toast.success(
            messages.success(`${formData.name} account`, "created"),
          );
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
          <Icon />
          <span className="hidden md:flex">{trigger}</span>
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

function AdminChangeUserRoleForm({
  data,
  setIsOpen,
}: {
  data: UserWithRole;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodAuth.pick({ role: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: data.role ?? defaultRole },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    const newRole = formData.role as Role;
    if (newRole === data.role)
      return toast.info(messages.noChanges(`${name}'s role`));

    setIsLoading(true);
    authClient.admin.setRole(
      { userId: data.id, role: newRole },
      {
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success(contentAuth.changeRole(data.name, newRole));
          setIsLoading(false);
          setIsOpen(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="gap-y-2">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change {`${data.name}'s`} Role</FormLabel>
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

        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <Spinner /> : <CircleFadingArrowUp />}
          {buttonText.save}
        </Button>
      </form>
    </Form>
  );
}

function AdminRevokeUserSessionsDialog({
  id,
  name,
}: Pick<Session["user"], "id" | "name">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { trigger, title, desc, success } = dialogs.adminRevokeSessions;

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
          toast.success(success(name));
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_warning" disabled={isLoading}>
          {isLoading ? <Spinner /> : <MonitorOff />}
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-warning flex items-center gap-x-2">
            <Info />
            {title(name)}
          </AlertDialogTitle>
          <AlertDialogDescription>{desc(name)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{buttonText.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "warning" })}
            onClick={clickHandler}
          >
            {buttonText.confirm}
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

  const { title, desc } = dialogs.adminRemove;

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
          {isLoading ? <Spinner /> : <Trash2 />}
          {buttonText.remove}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
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

/*
 * --- ADMIN ROW SELECTION ACTIONS ---
 */

function AdminActionRevokeUserSessionsDialog({
  ids,
  onSuccess,
}: {
  ids: string[];
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { trigger, titleMultiple, descMultiple, successMultiple } =
    dialogs.adminRevokeSessions;

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
        return successMultiple(successLength, ids.length);
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
            {titleMultiple(ids.length)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {descMultiple(ids.length)}
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

function AdminActionRemoveUsersDialog({
  data,
  onSuccess,
}: {
  data: Pick<Session["user"], "id" | "name" | "image">[];
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { titleMultiple, descMultiple, successMultiple } = dialogs.adminRemove;

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
        return successMultiple(successLength, data.length);
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
            <TriangleAlert /> {titleMultiple(data.length)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {descMultiple(data.length)}
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
