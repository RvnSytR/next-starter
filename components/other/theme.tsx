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
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      {...props}
    >
      <Sun className="flex dark:hidden" />
      <Moon className="hidden dark:flex" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
