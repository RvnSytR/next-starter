import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { title } from "@/components/content";
import { Toaster } from "@/components/ui/sonner";

const font = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: title.primary,
  description: title.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
