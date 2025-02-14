import Link from "next/link";
import { Metadata } from "next";

import { LoginForm } from "@/components/modules/auth";
import { page } from "@/components/content";
import { path, GetCurrentPage } from "@/components/menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionTitle } from "@/components/layout/section";

export const metadata: Metadata = { title: GetCurrentPage(path.login, true) };

export default function Page() {
  const { title, subtitle } = page.login;
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            <Link href="/" prefetch>
              <SectionTitle text={title} />
            </Link>
          </CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Separator />

          <LoginForm />

          <Separator />
        </CardContent>

        <CardFooter>
          <small className="mx-auto text-center">{page.copyright}</small>
        </CardFooter>
      </Card>
    </main>
  );
}
