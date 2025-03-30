"use client";

import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { label } from "@/lib/content";
import { route } from "@/lib/menu";
import { capitalize, cn } from "@/lib/utils";
import { zodAuth } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  LockKeyholeOpen,
  LogOut,
  Mail,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import { FormFloating } from "../custom/custom-field";
import { CustomIcon } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
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
import { sidebarMenuButtonVariants } from "../ui/sidebar";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <CustomButton
      icon={<LogOut />}
      variant="ghost_destructive"
      text={label.button.signOut}
      loading={isLoading}
      className={cn(
        sidebarMenuButtonVariants({ size: "sm" }),
        "hover:text-destructive justify-start",
      )}
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onRequest: () => setIsLoading(true),
            onSuccess: () => {
              toast.success(label.toast.success.user.signOut);
              router.push(route.auth);
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        })
      }
    />
  );
}

export function SignOnGithubButton() {
  return (
    <CustomButton
      variant="outline"
      icon={<CustomIcon customType="github" />}
      text={label.button.signOn("Github")}
      onClick={async () => {
        await authClient.signIn.social({
          provider: "github",
          callbackURL: route.protected,
          errorCallbackURL: route.auth,
        });
      }}
      onClickLoading
    />
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

  const formHandler = async (formData: z.infer<typeof schema>) => {
    await authClient.signIn.email(formData, {
      onRequest: () => setIsLoading(true),
      onSuccess: ({ data }) => {
        toast.success(label.toast.success.user.signIn(data?.user.name));
        setInterval(() => router.push(route.protected), 0);
      },
      onError: ({ error }) => {
        setIsLoading(false);
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

        <CustomButton
          type="submit"
          loading={isLoading}
          text={label.button.signIn}
        />
      </form>
    </Form>
  );
}

export function SignUpForm() {
  const router = useRouter();
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
      onRequest: () => setIsLoading(true),
      onSuccess: ({ data }) => {
        toast.success(label.toast.success.user.signUp(data?.user.name));
        setInterval(() => router.push(route.protected), 0);
      },
      onError: ({ error }) => {
        setIsLoading(false);
        toast.error(error.message);
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

        <CustomButton
          type="submit"
          loading={isLoading}
          text={label.button.signUp}
        />
      </form>
    </Form>
  );
}

// TODO form and upload
export function ProfilePicture({ name, image }: Pick<User, "name" | "image">) {
  return (
    <div className="flex items-center gap-x-4">
      <Avatar className="size-24">
        {image && <AvatarImage src={image} />}
        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-y-2">
        <Label>Profile Picture</Label>
        <div className="flex gap-x-2">
          <Button type="button" size="sm" variant="outline">
            Upload Avatar
          </Button>
          <Button type="button" size="sm" variant="outline_destructive">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PersonalInformation({ name, email, role, image }: User) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    await authClient.updateUser(
      { name: formData.name },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          toast.success(label.toast.success.user.updateProfile);
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="gap-y-6">
        <CardContent className="flex flex-col gap-y-4">
          <ProfilePicture name={name} image={image} />

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
                <FormLabel>Email Address *</FormLabel>
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
                <FormLabel>Status *</FormLabel>
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
          <CustomButton
            type="submit"
            loading={isLoading}
            icon={<Save />}
            text={label.button.update}
          />

          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {label.button.reset}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

// TODO change password
// TODO revoke session
// TODO danger zone
