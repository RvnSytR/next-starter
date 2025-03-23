"use client";

import { signIn, signOut } from "@/lib/auth-client";
import { label } from "@/lib/content";
import { path } from "@/lib/menu";
import { zodAuth } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LogOut, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import { FormFloating } from "../custom/custom-field";
import { CustomIcon } from "../icon";
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

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <CustomButton
      icon={<LogOut />}
      variant="outline_destructive"
      text={label.button.signOut}
      loading={isLoading}
      //   inSidebar
      onClick={() =>
        signOut({
          fetchOptions: {
            onRequest: () => setIsLoading(true),
            onSuccess: () => {
              toast.success(label.toast.success.signOut);
              // router.push(path.signIn);
              setIsLoading(false);
              router.refresh();
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
        await signIn.social({
          provider: "github",
          callbackURL: path.protected,
          errorCallbackURL: "/error",
          newUserCallbackURL: "/welcome",
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

  const formHandler = async (data: z.infer<typeof schema>) => {
    await signIn.email(data, {
      onRequest: () => setIsLoading(true),
      onSuccess: ({ data }) => {
        toast.success(label.toast.success.signIn(data?.user.name));
        // router.push(path.protected);
        setIsLoading(false);
        router.refresh();
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

  const schema = zodAuth.pick({
    email: true,
    password: true,
    rememberMe: true,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    await signIn.email(data, {
      onRequest: () => setIsLoading(true),
      onSuccess: ({ data }) => {
        toast.success(label.toast.success.signIn(data?.user.name));
        // router.push(path.protected);
        setIsLoading(false);
        router.refresh();
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

        {/* I agree to the Terms of Service and Privacy Policy. */}

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
          text={label.button.signUp}
        />
      </form>
    </Form>
  );
}
