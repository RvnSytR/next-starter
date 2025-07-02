import { SectionTagline } from "@/components/layout/section";
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
import { dashboardPage } from "@/lib/content";
import { getTitle } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: getTitle("signIn") };

export default function Page() {
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="mx-auto">
            <Link href="/">
              <h3>{dashboardPage.auth.title}</h3>
            </Link>
          </CardTitle>
          <CardDescription>{dashboardPage.auth.desc}</CardDescription>
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

        <CardFooter className="justify-center text-center">
          <SectionTagline />
        </CardFooter>
      </Card>
    </main>
  );
}
