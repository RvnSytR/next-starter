import { SectionTitle } from "@/components/layout/section";
import { LoginForm } from "@/components/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { page } from "@/lib/content";
import { GetCurrentPage, path } from "@/lib/menu";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: GetCurrentPage(path.login, true) };

export default function Page() {
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            <Link href="/" prefetch>
              <SectionTitle text={page.login.title} />
            </Link>
          </CardTitle>
          <CardDescription>{page.login.subtitle}</CardDescription>
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
