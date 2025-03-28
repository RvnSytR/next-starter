"use client";

import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { label } from "@/lib/content";
import { path } from "@/lib/menu";
import { capitalize, cn } from "@/lib/utils";
import { zodAuth } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IdCard,
  KeyRound,
  LockKeyholeOpen,
  LogOut,
  Mail,
  Pencil,
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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
              toast.success(label.toast.success.signOut);
              router.push(path.auth);
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
          callbackURL: path.protected,
          errorCallbackURL: path.auth,
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
        toast.success(label.toast.success.signIn(data?.user.name));
        router.push(path.protected);
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
        toast.success(label.toast.success.signUp(data?.user.name));
        router.push(path.protected);
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

// TODO
export function ProfilePicture({ name, image }: Pick<User, "name" | "image">) {
  return (
    <Card className="lg:aspect-square">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>

      <CardContent className="flex grow items-center justify-center">
        <div className="group relative rounded-full *:hover:cursor-pointer">
          <Avatar className="size-42 *:transition-[scale] *:group-hover:scale-110 lg:size-48">
            {image && <AvatarImage src={image} />}
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <Badge
            variant="outline"
            className="bg-card absolute right-0 bottom-2 border-2 py-1"
          >
            <Pencil />
            <small className="font-medium">Edit</small>
          </Badge>
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}

export function PersonalInformation({ id, name, email, role }: User) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = zodAuth
    .pick({ id: true, name: true, email: true, role: true })
    .refine((sc) => sc.id === id.slice(0, 5), {
      message: "Invalid ID",
      path: ["id"],
    })
    .refine((sc) => sc.email === email, {
      message: "Invalid email",
      path: ["email"],
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: id.slice(0, 5),
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
          toast.success(label.toast.success.updateProfile);
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );

    setIsLoading(false);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <Card id="personal-information" className="grow scroll-m-4">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="my-auto grid gap-x-2 gap-y-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID *</FormLabel>
                  <FormFloating icon={<IdCard />}>
                    <FormControl>
                      <Input type="password" disabled {...field} />
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

          <CardFooter className="gap-x-2">
            <CustomButton
              type="submit"
              loading={isLoading}
              icon={<Save />}
              text={label.button.save}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              <RotateCcw />
              {label.button.reset}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
