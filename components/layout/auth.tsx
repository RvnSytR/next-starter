"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { role } from "@/lib/db/schema";
import { CheckUser, CreateUser } from "@/server/action";

import { label, path } from "../content";
import { CustomButton } from "../global/custom-button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LogIn, Plus } from "lucide-react";
import { Separator } from "../ui/separator";

const { success, loading, button } = label;

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
      <form
        onSubmit={form.handleSubmit(formHandler)}
        className="flex flex-col gap-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
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
              <FormLabel>Password *</FormLabel>
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
          loadText={loading.button}
          icon={<LogIn />}
          className="mt-2"
          text={button.login}
        />
      </form>
    </Form>
  );
}

export function CreateUserDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const regisSchema = zodUserSchema.pick({
    email: true,
    username: true,
    password: true,
    role: true,
  });

  const form = useForm<z.infer<typeof regisSchema>>({
    resolver: zodResolver(regisSchema),
    defaultValues: { email: "", username: "", password: "", role: "user" },
  });

  const formHandler = async (data: z.infer<typeof regisSchema>) => {
    setIsLoading(true);

    toast.promise(CreateUser(data), {
      loading: loading.default,
      success: () => {
        setIsOpen(false);
        setIsLoading(false);
        return success.createAccountDialog;
      },
      error: (e: Error) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <CustomButton
          customType={null}
          variant="outline"
          icon={<Plus />}
          text={button.createAccountDialog}
          hideTextOnMobile
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Admin</DialogTitle>
          <DialogDescription>
            Masukkan informasi yang diperlukan untuk menambah akun pengguna
            baru.
          </DialogDescription>
        </DialogHeader>

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
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan Username"
                      {...field}
                    />
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
                  <FormLabel>Password *</FormLabel>
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

            {/* Status Pengguna */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status Pengguna *</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Pengguna" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {role
                        .filter((item) => item !== "pending")
                        .map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-2" />

            <DialogFooter className="gap-y-2">
              <DialogClose asChild>
                <Button type="button" size="sm" variant="outline">
                  Kembali
                </Button>
              </DialogClose>

              <CustomButton
                customType={null}
                type="submit"
                size="sm"
                load={isLoading}
                loadText={loading.button}
                text="Konfirmasi"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
