"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";

import { CheckUser } from "@/server/action";

import { z } from "zod";
import { zodUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { label, path } from "../content";
import { CustomButton } from "../global/custom-button";

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
import { LogIn } from "lucide-react";
import { SignOutHandler } from "@/app/login/sign";

const { success, loading, button } = label;

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

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const formHandler = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = data;
    setIsLoading(true);

    toast.promise(CheckUser(email, password), {
      loading: loading.default,
      success: () => {
        router.push(path.protected);
        return success.login;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="section-y">
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

        <CustomButton
          customType={null}
          type="submit"
          load={isLoading}
          loadText={loading.login}
          icon={<LogIn />}
          className="mt-2"
        >
          {button.login}
        </CustomButton>
      </form>
    </Form>
  );
}
