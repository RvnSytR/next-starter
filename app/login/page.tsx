import Link from "next/link";
import { Metadata } from "next";

import { GetCurrentPage } from "@/components/menu";
import { page, path } from "@/components/content";
import { LoginForm } from "@/components/layout/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: GetCurrentPage(path.login, true),
};

export default function Page() {
  const { title, subtitle } = page.login;
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="mb-1 text-center">
            <Link href="/" prefetch>
              {title}
            </Link>
          </CardTitle>
          <CardDescription className="text-center">{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Separator />

          <LoginForm />

          <Separator className="mt-2" />
        </CardContent>

        <CardFooter>
          <small className="mx-auto text-center">{page.copyright}</small>
        </CardFooter>
      </Card>
    </main>
  );
}
