"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle({ className, ...props }: ButtonProps) {
  const { setTheme } = useTheme();
  return (
    <Button
      size="iconsm"
      variant="ghost"
      className={cn("flex-none", className)}
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      {...props}
    >
      <Sun className="rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
