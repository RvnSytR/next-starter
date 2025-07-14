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
  const { theme, setTheme } = useTheme();
  const Icon = theme === "dark" ? Moon : Sun;
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("shrink-0", className)}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      {...props}
    >
      <Icon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
