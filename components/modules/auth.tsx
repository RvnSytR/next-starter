"use client";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { mediaMetadata, route } from "@/lib/const";
import { buttonText, dialog, toastMessage, zodMessage } from "@/lib/content";
import { allRoles, Role, roleMetadata, userRoles } from "@/lib/permission";
import { capitalize, cn } from "@/lib/utils";
import { zodAuth, zodFile } from "@/lib/zod";
import { deleteProfilePicture, redirectAction } from "@/server/action";
import { getFilePublicUrl, uploadFile } from "@/server/s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithRole } from "better-auth/plugins";
import { formatDistanceToNow } from "date-fns";
import {
  Ban,
  CircleFadingArrowUp,
  Dot,
  EllipsisVertical,
  Gamepad2,
  Layers2,
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
import { FormFloating } from "../custom/custom-field";
import { userColumn, userColumnHelper } from "../data-table/column";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { SidebarMenuButton } from "../ui/sidebar";

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
    <Avatar className={className}>
      {image ? (
        <>
          <AvatarImage className={imageCn} src={image} />
          <AvatarFallback className={fallbackCn}>{fallbackName}</AvatarFallback>
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      size="sm"
      className="text-destructive hover:text-destructive"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        toast.promise(authClient.signOut(), {
          loading: toastMessage.default.loading,
          error: (e) => {
            setIsLoading(false);
            return e.message;
          },
          success: () => {
            redirectAction(route.signIn);
            return toastMessage.user.signOut;
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
        toast.promise(
          authClient.signIn.social({
            provider: "github",
            callbackURL: route.protected,
            errorCallbackURL: route.signIn,
          }),
          {
            loading: toastMessage.default.loading,
            error: (e) => e.message,
            success: toastMessage.user.signIn(),
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
    toast.promise(authClient.signIn.email(formData), {
      loading: toastMessage.default.loading,
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
      success: (res) => {
        redirectAction(route.protected);
        return toastMessage.user.signIn(res.data?.user.name);
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
            <FormItem className="flex items-center gap-2">
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
      message: zodMessage.confirmPassword,
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
    toast.promise(authClient.signUp.email(formData), {
      loading: toastMessage.default.loading,
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
      success: () => {
        setIsLoading(false);
        form.reset();
        return toastMessage.user.signUp;
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

  const schema = zodFile("image");
  const changeHandler = (fileList: FileList) => {
    const parseRes = schema.safeParse(Array.from(fileList).map((file) => file));
    if (!parseRes.success) return toast.error(parseRes.error.errors[0].message);

    setIsChange(true);
    toast.promise(
      async () => {
        const formData = new FormData();
        const file = fileList[0];
        const fileKey = `${id}_${file.name}`;
        const fileUrl = await getFilePublicUrl(fileKey);

        formData.append(fileKey, file);
        if (image && fileUrl !== image) await deleteProfilePicture(image);

        await uploadFile({
          formData: formData,
          names: [fileKey],
          nameAskey: true,
          ACL: "public-read",
        });

        await authClient.updateUser({ image: fileUrl });
      },
      {
        loading: toastMessage.default.loading,
        error: (e) => {
          setIsChange(false);
          return e.message;
        },
        success: () => {
          setIsChange(false);
          router.refresh();
          return toastMessage.default.success("avatar", "updated");
        },
      },
    );
  };

  const deleteHandler = () => {
    setIsRemoved(true);
    toast.promise(
      async () => {
        if (image) await deleteProfilePicture(image);
        await authClient.updateUser({ image: null });
      },
      {
        loading: toastMessage.default.loading,
        error: (e) => {
          setIsRemoved(false);
          return e.message;
        },
        success: () => {
          setIsRemoved(false);
          router.refresh();
          return toastMessage.default.success("avatar", "removed");
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
        accept={mediaMetadata.image.type.join(", ")}
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
                <AlertDialogCancel
                  className={buttonVariants({ variant: "outline" })}
                >
                  {buttonText.cancel}
                </AlertDialogCancel>
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

export function PersonalInformation({
  ...props
}: Pick<Session["user"], "id" | "name" | "email" | "image" | "role">) {
  const router = useRouter();
  const [loading, setIsLoading] = useState<boolean>(false);

  const { name, email, role } = props;
  const schema = zodAuth.pick({ name: true, email: true, role: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
      email: email,
      role: role ? capitalize(role) : null,
    },
  });

  const formHandler = ({ name: newName }: z.infer<typeof schema>) => {
    if (newName === name) return toast.info(toastMessage.noChanges("profile"));
    setIsLoading(true);
    toast.promise(authClient.updateUser({ name: newName }), {
      loading: toastMessage.default.loading,
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
      success: () => {
        setIsLoading(false);
        router.refresh();
        return toastMessage.default.success("profile", "updated");
      },
    });
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
                <FormLabel>Role</FormLabel>
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
      message: zodMessage.confirmPassword,
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formHandler = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    toast.promise(authClient.changePassword(formData), {
      loading: toastMessage.default.loading,
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
      success: () => {
        setIsLoading(false);
        form.reset();
        router.refresh();
        return toastMessage.default.success("password", "updated");
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
              <FormItem className="flex items-center gap-2">
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

        <Separator />

        <CardFooter className="gap-x-2">
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
    toast.promise(authClient.revokeSession({ token }), {
      loading: toastMessage.default.loading,
      error: (e) => e.message,
      success: () => {
        router.refresh();
        return toastMessage.default.success("sessions", "terminated", "The");
      },
    });
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

export function RevokeAllOtherSessionButton() {
  const router = useRouter();
  const { trigger, title, desc } = dialog.profile.revokeAllOtherSession;

  const clickHandler = () => {
    toast.promise(authClient.revokeOtherSessions(), {
      loading: toastMessage.default.loading,
      error: (e) => e.message,
      success: () => {
        router.refresh();
        return toastMessage.default.success("other sessions", "terminated");
      },
    });
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        if (image) await deleteProfilePicture(image);
        authClient.deleteUser({ callbackURL: route.signIn });
      },
      {
        loading: toastMessage.default.loading,
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
        success: () => {
          setIsLoading(false);
          redirectAction(route.signIn);
          return (
            toastMessage.default.success("account", "removed") + " Goodbye!"
          );
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

export function AdminAccountDataTable({
  data,
  currentUser,
  ...props
}: OtherDataTableProps & {
  data: UserWithRole[];
  currentUser: Session["user"];
}) {
  const columns = [
    ...userColumn,
    userColumnHelper.display({
      id: "Action",
      header: "Action",
      cell: ({ row }) => {
        if (row.original.id === currentUser.id) {
          return <Badge variant="outline">Current User</Badge>;
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="flex w-fit flex-col gap-y-1 p-1 [&_button]:justify-start"
            >
              <div className="px-2 py-1 text-center">
                <small className="font-medium">{row.original.name}</small>
              </div>

              <Separator />

              <AdminChangeUserRoleDialog {...row.original} />

              <Button size="sm" variant="ghost" disabled>
                <Layers2 />
                Impersonate Session
              </Button>

              <AdminTerminateUserSessionDialog {...row.original} />

              <Button size="sm" variant="ghost_destructive" disabled>
                <Ban />
                Ban
              </Button>

              <AdminRemoveUserDialog {...row.original} />
            </PopoverContent>
          </Popover>
        );
      },
    }),
  ];

  return <DataTable data={data} columns={columns} {...props} />;
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
      message: zodMessage.confirmPassword,
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
    setIsLoading(true);
    toast.promise(
      authClient.admin.createUser({ role: role as Role, ...restData }),
      {
        loading: toastMessage.default.loading,
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
        success: () => {
          setIsLoading(false);
          form.reset();
          router.refresh();
          return toastMessage.default.success(
            "account",
            "created",
            formData.name,
          );
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Icon />
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
                        const { displayName, icon: RoleIcon } =
                          roleMetadata[item];
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
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {buttonText.cancel}
                </Button>
              </DialogClose>

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

export function AdminChangeUserRoleDialog({
  id,
  name,
  role,
}: Pick<Session["user"], "id" | "name" | "role">) {
  const router = useRouter();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const schema = zodAuth.pick({ role: true });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: role },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    const newRole = formData.role as Role;
    if (newRole === role)
      return toast.info(toastMessage.noChanges("role", name));

    setIsLoading(true);
    toast.promise(authClient.admin.setRole({ userId: id, role: newRole }), {
      loading: toastMessage.default.loading,
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
      success: () => {
        setIsLoading(false);
        setIsOpen(false);
        router.refresh();
        return toastMessage.user.changeRole(name, newRole);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={loading}>
          {loading ? <Spinner /> : <CircleFadingArrowUp />}
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
                        const { displayName, icon: RoleIcon } =
                          roleMetadata[item];
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
              <DialogClose className={buttonVariants({ variant: "outline" })}>
                {buttonText.cancel}
              </DialogClose>

              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : <CircleFadingArrowUp />}
                {dialog.user.changeRole.trigger}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminTerminateUserSessionDialog({
  id,
  name,
}: Pick<Session["user"], "id" | "name">) {
  const clickHandler = () => {
    toast.promise(authClient.admin.revokeUserSessions({ userId: id }), {
      loading: toastMessage.default.loading,
      error: (e) => e.message,
      success: toastMessage.user.revokeSession(name),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive">
          <MonitorOff />
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

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        if (image) await deleteProfilePicture(image);
        await authClient.admin.removeUser({ userId: id });
      },
      {
        loading: toastMessage.default.loading,
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
        success: () => {
          setIsLoading(false);
          router.refresh();
          return toastMessage.default.success("account", "removed", name);
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
