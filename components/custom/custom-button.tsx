"use client";

import { label } from "@/lib/content";
import { cn, delay } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Spinner } from "../other/icon";
import { Button, ButtonProps } from "../ui/button";

type LoadingIcon = { defaultIcon?: ReactNode; loadingIcon?: ReactNode };

export function LinkLoader({
  defaultIcon,
  loadingIcon = <Spinner />,
}: LoadingIcon) {
  const { pending } = useLinkStatus();
  return pending ? loadingIcon : defaultIcon;
}

export function RefreshButton({
  text = label.button.refresh,
  defaultIcon = <Spinner spinnerType="refresh" animate={false} />,
  loadingIcon = <Spinner spinnerType="refresh" />,
  ...props
}: Omit<ButtonProps, "onClick" | "children"> &
  LoadingIcon & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      onClick={async () => {
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
  ...props
}: Omit<ButtonProps, "onClick" | "children"> & { value: string }) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size}
      onClick={async () => {
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
