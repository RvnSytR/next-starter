"use client";

import { actions } from "@/lib/content";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { Button, ButtonProps, ButtonPropsWithoutChildren } from "./button";

type PulsatingButtonProps = ButtonProps & {
  pulseColor?: string;
  duration?: string;
};

export function ResetButton({
  type = "reset",
  size = "default",
  variant = "outline",
  ...props
}: ButtonPropsWithoutChildren) {
  return (
    <Button type={type} size={size} variant={variant} {...props}>
      <RotateCcw /> {actions.reset}
    </Button>
  );
}

export function PulsatingButton({
  className,
  children,
  pulseColor = "var(--primary-pulse)",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  return (
    <Button
      className={cn("relative", className)}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <>
        <div className="relative z-10 flex items-center gap-x-2">
          {children}
        </div>
        <div className="absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-inherit" />
      </>
    </Button>
  );
}
