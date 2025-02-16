"use client";

import Link, { type LinkProps } from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { SignOutHandler } from "@/app/login/sign";

import { cn } from "@/lib/utils";
import { Delay } from "@/lib/utils";
import { label } from "../content";
import { path } from "../menu";

import { toast } from "sonner";
import { CustomLoader } from "../icon";
import { Button, ButtonProps } from "../ui/button";
import { sidebarMenuButtonVariants } from "../ui/sidebar";
import { Check, Copy, LogOut } from "lucide-react";

// #region // * Types
type OptionalChildrenProps = { text?: string; icon?: string };
type RequiredChildrenProps =
  | { text: string; icon?: ReactNode }
  | { text?: string; icon: ReactNode };

type CustomTypeProps =
  | ({ customType: "logout" | "refresh" } & OptionalChildrenProps)
  | ((
      | { customType?: never }
      | { customType: "copy"; copyValue: string }
      | { customType: "scroll"; elementId: string; offset?: number }
    ) &
      RequiredChildrenProps);

export type CustomButtonProps = Omit<ButtonProps, "children"> &
  CustomTypeProps & {
    iconPosition?: "left" | "right";
    loading?: boolean;
    withLoading?: boolean;
    inSidebar?: boolean;
    hideTextOnMobile?: boolean;
    customLoader?: ReactNode;
  };
// #endregion

export function CustomButton({
  customType,
  text,
  icon,
  iconPosition = "left",
  loading = false,
  withLoading = false,
  inSidebar = false,
  hideTextOnMobile = false,
  customLoader = (
    <CustomLoader
      customType={customType === "refresh" ? "refresh" : "circle"}
    />
  ),
  type = "button",
  size,
  variant,
  className,
  onClick,
  ...props
}: CustomButtonProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(loading);

  let buttonProps: typeof props = props;
  let action: () => Promise<void> | void = () => {};

  switch (customType) {
    case "logout": {
      icon = <LogOut />;
      text = label.button.logout;
      variant = "outline_destructive";

      action = () => {
        toast.promise(SignOutHandler(), {
          loading: label.toast.loading.default,
          success: () => {
            router.push(path.login);
            return label.toast.success.logout;
          },
          error: (e: Error) => {
            setIsLoading(false);
            return e.message;
          },
        });
      };
      break;
    }

    case "refresh": {
      icon = <CustomLoader customType="refresh" animate={false} />;
      text = label.button.refresh;

      action = async () => {
        setIsLoading(true);
        await Delay(0.5);
        router.refresh();
        setIsLoading(false);
      };

      break;
    }

    case "copy": {
      icon = <Copy />;
      customLoader = <Check />;
      const { copyValue, ...rest } = props as Extract<
        CustomButtonProps,
        { customType: "copy" }
      >;

      buttonProps = rest;
      action = async () => {
        setIsLoading(true);
        navigator.clipboard.writeText(copyValue);
        await Delay(1);
        setIsLoading(false);
      };

      break;
    }

    case "scroll": {
      const {
        elementId,
        offset = 80,
        ...rest
      } = props as Extract<CustomButtonProps, { customType: "scroll" }>;

      buttonProps = rest;
      action = async () => {
        const element = document.getElementById(elementId);
        if (!element) return;
        window.scroll({ top: element.offsetTop - offset });
      };

      break;
    }
  }

  const ButtonNode = ({ children }: { children: ReactNode }) => {
    return (
      <Button
        type={type}
        variant={variant}
        disabled={isLoading}
        size={
          !text || (hideTextOnMobile && isMobile)
            ? size === "lg"
              ? "iconlg"
              : size === "sm"
                ? "iconsm"
                : "icon"
            : size
        }
        className={cn(
          "shrink-0 group-data-[collapsible=icon]:justify-start",
          inSidebar &&
            sidebarMenuButtonVariants({
              size:
                size === "iconlg" ? "lg" : size === "iconsm" ? "sm" : "default",
            }),
          className,
        )}
        onClick={async (e) => {
          if (withLoading) setIsLoading(true);
          if (onClick) onClick(e);
          await action();
        }}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  };

  const ChildrenNode = () => {
    const iconNode = isLoading ? customLoader : icon;
    if (!text) return iconNode;

    const node = (
      <Fragment>
        {iconPosition === "left" && iconNode}
        <span className={cn(hideTextOnMobile && "hidden md:flex")}>{text}</span>
        {iconPosition === "right" && iconNode}
      </Fragment>
    );

    return node;
  };

  return (
    <ButtonNode>
      <ChildrenNode />
    </ButtonNode>
  );
}
