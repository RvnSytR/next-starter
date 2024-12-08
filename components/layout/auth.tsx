"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";

import { Check } from "@/server/action-user";

import { z } from "zod";
import { zodUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomLoader } from "../global/icon";
import { LABEL, PATH } from "../content";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { SignOutHandler } from "@/app/login/sign";

export function SignOutComponent({
  session,
}: {
  session: Session | null;
}): React.ReactNode {
  useEffect(() => {
    if (session) SignOutHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginSchema = zodUserSchema.pick({ email: true, password: true });
  const { button, loading, login } = LABEL;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = data;
    setIsLoading(true);

    toast.promise(Check(email, password), {
      loading: loading.default,
      success: () => {
        router.push(PATH.dashboard);
        return login;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formHandler)}
        className="flex flex-col gap-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Masukkan Email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Masukkan Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <CustomLoader customType="circle" /> : <LogIn />}
          {isLoading ? loading.login : button.login}
        </Button>
      </form>
    </Form>
  );
}
