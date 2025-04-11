"use client";

import { label } from "@/lib/content";
import { delay } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Spinner } from "../icon";
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
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Button
      onClick={async () => {
        setLoading(true);
        await delay(0.5);
        router.refresh();
        setLoading(false);
      }}
      {...props}
    >
      {loading ? loadingIcon : defaultIcon}
      {text}
    </Button>
  );
}

export function CopyButton({
  value,
  defaultIcon = <Copy />,
  loadingIcon = <Check />,
  ...props
}: Omit<ButtonProps, "onClick" | "children"> &
  LoadingIcon & { value: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Button
      onClick={async () => {
        setLoading(true);
        navigator.clipboard.writeText(value);
        await delay(1);
        setLoading(false);
      }}
      {...props}
    >
      {loading ? loadingIcon : defaultIcon}
    </Button>
  );
}
