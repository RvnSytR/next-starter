"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({
  size = "iconsm",
  variant = "ghost",
  className,
  ...props
}: Omit<ButtonProps, "onClick">) {
  const { setTheme } = useTheme();
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("shrink-0", className)}
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      {...props}
    >
      <Sun className="scale-100 rotate-0 transition dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
