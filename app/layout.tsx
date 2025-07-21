import { GridPattern } from "@/components/other/grid-pattern";
import { Toaster } from "@/components/ui/sonner";
import { appInfo } from "@/lib/const";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, Lora } from "next/font/google";

const geistFont = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const loraFont = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const geistMonoFont = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

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
    <html lang={appInfo.lang} suppressHydrationWarning>
      <body
        className={cn(
          geistFont.variable,
          loraFont.variable,
          geistMonoFont.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <GridPattern className="stroke-muted dark:stroke-muted/60 -z-1" />
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
