import { GridPattern } from "@/components/ui/grid-pattern";
import { Toaster } from "@/components/ui/sonner";
import { appMeta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import "@/styles/global.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";

const geistFont = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMonoFont = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: appMeta.name,
  description: appMeta.description,
  keywords: appMeta.keywords,
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={appMeta.lang} suppressHydrationWarning>
      <body className={cn(geistFont.variable, geistMonoFont.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <GridPattern className="stroke-muted dark:stroke-muted/60 -z-1 min-h-dvh" />
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
