"use client";

import { SectionTitle } from "@/components/layout/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signIn, signOut } from "@/lib/auth-client";
import { label, page } from "@/lib/content";
import { cn } from "@/lib/utils";
import { zodAuth } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LogIn, LogOut, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import { FormFloating } from "../custom/custom-field";
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

export function SignInForm({ className }: { className?: string }) {
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
    <Card className={cn("w-full md:w-md", className)}>
      <CardHeader className="text-center">
        <CardTitle>
          <Link href="/" className="flex items-center justify-center gap-2">
            <SectionTitle text={page.signIn.title} />
          </Link>
        </CardTitle>
        <CardDescription>{page.signIn.subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-4">
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formHandler)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormFloating icon={<Mail />}>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Email"
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
              icon={<LogIn />}
              text={label.button.signIn}
            />
          </form>
        </Form>
        <Separator />
      </CardContent>

      <CardFooter>
        <small className="mx-auto text-center">{page.copyright}</small>
      </CardFooter>
    </Card>
  );
}
