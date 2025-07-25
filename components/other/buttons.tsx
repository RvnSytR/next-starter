"use client";

import { buttonText } from "@/lib/content";
import { cn, delay } from "@/lib/utils";
import { ArrowUp, Check, Copy, Moon, RefreshCcw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Loader, LoaderProps } from "./icon";

type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;
type ButtonIconSize = "iconlg" | "icon" | "iconsm";

export function LinkLoader({ ...props }: LoaderProps) {
  const { pending } = useLinkStatus();
  return <Loader loading={pending} {...props} />;
}

export function ThemeToggle({
  size = "icon",
  variant = "ghost",
  ...props
}: Omit<ButtonProps, "onClick">) {
  const { setTheme } = useTheme();
  return (
    <Button
      size={size}
      variant={variant}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      {...props}
    >
      <Sun className="flex dark:hidden" />
      <Moon className="hidden dark:flex" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function CopyButton({
  value,
  size = "icon",
  disabled,
  onClick,
  ...props
}: Omit<ButtonPropsWithoutChildren, "value" | "size"> & {
  value: string;
  size?: ButtonIconSize;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size}
      disabled={copied || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setCopied(true);
        navigator.clipboard.writeText(value);
        await delay(1);
        setCopied(false);
      }}
      {...props}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      <Copy className={cn("transition", copied ? "scale-0" : "scale-100")} />
      <Check
        className={cn("absolute transition", copied ? "scale-100" : "scale-0")}
      />
    </Button>
  );
}

export function RefreshButton({
  text = buttonText.refresh,
  disabled,
  onClick,
  ...props
}: ButtonPropsWithoutChildren & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const Icon = RefreshCcw;
  const iconCn = "animate-reverse animate-spin";

  return (
    <Button
      disabled={refreshing || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.refresh();
        setRefreshing(false);
      }}
      {...props}
    >
      <Loader
        loading={refreshing}
        icon={{ base: <Icon />, loader: <Icon className={iconCn} /> }}
      />
      {text}
    </Button>
  );
}

export function ScrollToTopButton({
  size = "iconlg",
  className,
  onClick,
  ...props
}: ButtonPropsWithoutChildren) {
  return (
    <Button
      size={size}
      className={cn(
        "fixed right-4 bottom-4 z-40 rounded-full lg:right-10 lg:bottom-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
