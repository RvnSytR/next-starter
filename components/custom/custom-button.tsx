"use client";

import { buttonText } from "@/lib/content";
import { cn, delay } from "@/lib/utils";
import { ArrowUp, Check, Copy } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Spinner } from "../other/icon";
import { Button, ButtonProps } from "../ui/button";

type LoadingProps = { defaultIcon?: ReactNode; loadingIcon?: ReactNode };

export function LinkLoader({
  defaultIcon,
  loadingIcon = <Spinner />,
}: LoadingProps) {
  const { pending } = useLinkStatus();
  return pending ? loadingIcon : defaultIcon;
}

export function RefreshButton({
  text = buttonText.refresh,
  defaultIcon = <Spinner spinnerType="refresh" animate={false} />,
  loadingIcon = <Spinner spinnerType="refresh" />,
  onClick,
  ...props
}: LoadingProps & Omit<ButtonProps, "children"> & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.refresh();
        setRefreshing(false);
      }}
      {...props}
    >
      {refreshing ? loadingIcon : defaultIcon}
      {text}
    </Button>
  );
}

export function CopyButton({
  size = "icon",
  value,
  onClick,
  ...props
}: Omit<ButtonProps, "children"> & { value: string }) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size}
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
        className={cn(
          "absolute transition",
          copied ? "scale-100" : "- scale-0",
        )}
      />
    </Button>
  );
}

export function ScrollToTopButton({
  size = "iconlg",
  className,
  onClick,
  ...props
}: Omit<ButtonProps, "children">) {
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
