import { SectionTitle } from "@/components/layout/section";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import {
  SignInForm,
  SignOnGithubButton,
  SignUpForm,
} from "@/components/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { page } from "@/lib/content";
import { GetCurrentPage, path } from "@/lib/menu";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: GetCurrentPage(path.auth, true) };

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center">
      <AnimatedGridPattern className="animate-fade fill-input/25 stroke-input/25 z-[-1]" />

      <div className="container flex justify-center">
        <Card className="w-full md:w-md">
          <CardHeader className="text-center">
            <CardTitle>
              <Link href="/" className="flex items-center justify-center gap-2">
                <SectionTitle text={page.auth.title} />
              </Link>
            </CardTitle>
            <CardDescription>{page.auth.subtitle}</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-y-4">
            <Tabs defaultValue="sign-in">
              <TabsList>
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUpForm />
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-x-2">
              <div className="grow border-t before:border-t" />
              <small className="text-muted-foreground text-xs font-medium">
                Or
              </small>
              <div className="grow border-t after:border-t" />
            </div>

            <SignOnGithubButton />
          </CardContent>

          <CardFooter>
            <CardDescription className="mx-auto">
              {page.copyright}
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
