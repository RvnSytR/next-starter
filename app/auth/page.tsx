import { GridPattern } from "@/components/magicui/grid-pattern";
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
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: page.metadata("Get Started") };

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center">
      <GridPattern className="stroke-input/50 z-[-1]" />

      <div className="container flex justify-center py-8">
        <Card className="w-full md:w-md">
          <CardHeader className="text-center">
            <CardTitle className="mx-auto">
              <Link href="/">
                <h3>{page.auth.title}</h3>
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
