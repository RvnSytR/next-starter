import { GridPattern } from "@/components/other-ui/grid-pattern";
import { Toaster } from "@/components/ui/sonner";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: appInfo.name,
  description: appInfo.description,
  keywords: appInfo.keywords,
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "relative")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <GridPattern className="stroke-accent/40 dark:stroke-accent/20 -z-1" />
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
