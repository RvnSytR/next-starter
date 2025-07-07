"use client";

import { buttonText } from "@/lib/content";
import { cn, delay } from "@/lib/utils";
import { ArrowUp, Check, Copy } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Spinner } from "../other/icon";
import { Button, ButtonProps } from "../ui/button";

type LoadingIcon = { defaultIcon?: ReactNode; loadingIcon?: ReactNode };
type LoadingIconWihtText = LoadingIcon & { text?: string };
type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;

export function LinkLoader({
  defaultIcon,
  loadingIcon = <Spinner />,
}: LoadingIcon) {
  const { pending } = useLinkStatus();
  return pending ? loadingIcon : defaultIcon;
}

export function RefreshButton({
  text = buttonText.refresh,
  defaultIcon = <Spinner spinnerType="refresh" animate={false} />,
  loadingIcon = <Spinner spinnerType="refresh" />,
  disabled,
  onClick,
  ...props
}: ButtonPropsWithoutChildren & LoadingIconWihtText) {
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
      {refreshing ? loadingIcon : defaultIcon}
      {text}
    </Button>
  );
}

export function CopyButton({
  value,
  text,
  iconCn,
  size,
  disabled,
  onClick,
  ...props
}: ButtonPropsWithoutChildren & {
  value: string;
  text?: string;
  iconCn?: string;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size ?? (text ? "default" : "icon")}
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
      <Copy
        className={cn("transition", copied ? "scale-0" : "scale-100", iconCn)}
      />
      <Check
        className={cn(
          "absolute transition",
          copied ? "scale-100" : "scale-0",
          iconCn,
        )}
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
