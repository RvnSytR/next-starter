"use client";

import { actions } from "@/lib/content";
import { cn, delay } from "@/lib/utils";
import { useLayout } from "@/providers/layout";
import {
  ArrowUp,
  Check,
  Copy,
  Frame,
  Minimize,
  Moon,
  RefreshCcw,
  Scan,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingSpinner, LoadingSpinnerProps } from "./spinner";

type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;
type ButtonIconSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export function LinkLoader({ ...props }: Omit<LoadingSpinnerProps, "loading">) {
  const { pending } = useLinkStatus();
  return <LoadingSpinner loading={pending} {...props} />;
}

export function ThemeButton({
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: ButtonPropsWithoutChildren) {
  const { setTheme } = useTheme();
  return (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }}
      {...props}
    >
      <Sun className="flex dark:hidden" />
      <Moon className="hidden dark:flex" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function LayoutButton({
  size = "icon",
  variant = "ghost",
  onClick,
  disabled,
  ...props
}: ButtonPropsWithoutChildren) {
  const { layout, setLayout } = useLayout();
  const LayoutIcon = !layout
    ? Frame
    : { fullwidth: Scan, centered: Minimize }[layout];

  return (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        setLayout((prev) => (prev === "fullwidth" ? "centered" : "fullwidth"));
      }}
      disabled={disabled || !layout}
      {...props}
    >
      <LayoutIcon />
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
  text = actions.refresh,
  disabled,
  onClick,
  ...props
}: ButtonPropsWithoutChildren & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
      <LoadingSpinner
        variant="refresh"
        loading={refreshing}
        className="animate-reverse"
        icon={{ base: <RefreshCcw /> }}
      />
      {text}
    </Button>
  );
}

export function ScrollToTopButton({
  size = "icon-lg",
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
