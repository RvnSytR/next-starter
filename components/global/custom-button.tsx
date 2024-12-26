"use client";

import Link, { type LinkProps } from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { SignOutHandler } from "@/app/login/sign";

import { cn } from "@/lib/utils";
import { Delay } from "@/lib/utils";
import { label, path } from "../content";

import { toast } from "sonner";
import { CustomLoader } from "./icon";
import { Button, ButtonProps } from "../ui/button";
import { LogOut, RefreshCw, Sparkle } from "lucide-react";

// #region // * Types
type CustomType =
  | {
      customType: "loading" | "logout" | "refresh" | null | undefined;
    }
  | ({ customType: "nav" } & LinkProps &
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">)
  | ({
      customType: "pulse";
      pulseColor?: string;
    } & (LinkProps | { href?: null | undefined }))
  | {
      customType: "scroll";
      elementid: string;
      offset?: number;
    };

export type CustomButtonProps = Omit<ButtonProps, "children"> &
  CustomType & {
    text?: string;
    load?: boolean;
    loadText?: string;
    hideTextOnMobile?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
  };
// #endregion

export function CustomButton({
  customType,
  text,
  load,
  loadText,
  hideTextOnMobile = false,
  icon,
  iconPosition = "left",
  ...props
}: CustomButtonProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { success, loading, button } = label;

  //#region // * Nodes
  type CustomButtonNode = { required?: boolean; children: ReactNode } & Pick<
    ButtonProps,
    "style" | "className" | "onClick" | "asChild"
  >;

  const ButtonNode = ({ children, ...nodeProps }: CustomButtonNode) => {
    const { size, ...restProps } = props;
    const { required, ...restNodeProps } = nodeProps;
    if (required && !text && !icon) return <RequiredNode />;

    return (
      <Button
        type="button"
        size={
          !text || (hideTextOnMobile && isMobile)
            ? size === "lg" || size === "iconlg"
              ? "iconlg"
              : size === "sm" || size === "iconsm"
                ? "iconsm"
                : "icon"
            : size
        }
        disabled={load ?? isLoading}
        {...restProps}
        {...restNodeProps}
      >
        {children}
      </Button>
    );
  };

  const LoadingButtonNode = ({ children, ...nodeProps }: CustomButtonNode) => {
    return (
      <ButtonNode onClick={() => setIsLoading(true)} {...nodeProps}>
        {children}
      </ButtonNode>
    );
  };

  const ChildrenNode = ({ customLoader }: { customLoader?: ReactNode }) => {
    const isLoad = load ?? isLoading;
    const iconNode = isLoad
      ? (customLoader ?? <CustomLoader customType="circle" />)
      : icon;

    if (!text) return iconNode;

    return (
      <Fragment>
        {iconPosition === "left" && iconNode}
        <span
          className={cn(
            "group-data-[collapsible=icon]:hidden",
            hideTextOnMobile ? "hidden md:flex" : "",
          )}
        >
          {isLoad ? (loadText ?? text) : text}
        </span>
        {iconPosition === "right" && iconNode}
      </Fragment>
    );
  };

  const RequiredNode = ({ destructive = false }: { destructive?: boolean }) => {
    return (
      <Button
        variant={destructive ? "destructive" : "default"}
        className="animate-wiggle animate-infinite"
        disabled
      >
        <Sparkle /> Custom Button {destructive && "Undefined!"}
      </Button>
    );
  };
  //#endregion

  switch (customType) {
    case "loading": {
      return (
        <LoadingButtonNode required>
          <ChildrenNode />
        </LoadingButtonNode>
      );
    }

    case "logout": {
      text = button.logout;
      loadText = loading.logout;
      icon = <LogOut />;

      return (
        <LoadingButtonNode
          required
          onClick={async () => {
            setIsLoading(true);
            toast.promise(SignOutHandler(), {
              loading: loading.default,
              success: () => {
                router.push(path.login);
                return success.logout;
              },
              error: (e: Error) => {
                setIsLoading(false);
                return e.message;
              },
            });
          }}
        >
          <ChildrenNode />
        </LoadingButtonNode>
      );
    }

    case "nav": {
      const { ...linkProps } = props as Extract<
        CustomType,
        { customType: "nav" }
      >;

      return (
        <LoadingButtonNode required asChild>
          <Link {...linkProps}>
            <ChildrenNode />
          </Link>
        </LoadingButtonNode>
      );
    }

    case "pulse": {
      const { className } = props;
      const {
        pulseColor = "#FACC15",
        href,
        ...linkProps
      } = props as Extract<CustomType, { customType: "pulse" }>;

      const PulseFragment = () => {
        return (
          <Fragment>
            <ChildrenNode />
            <div className="absolute size-full animate-pulse rounded-md" />
          </Fragment>
        );
      };

      return (
        <LoadingButtonNode
          style={
            {
              "--pulse-color": pulseColor,
            } as React.CSSProperties
          }
          className={cn("relative", className)}
          asChild={!!href}
          required
        >
          {href ? (
            <Link href={href} {...linkProps}>
              <PulseFragment />
            </Link>
          ) : (
            <PulseFragment />
          )}
        </LoadingButtonNode>
      );
    }

    case "refresh": {
      text = button.refresh;
      loadText = loading.refresh;
      icon = <RefreshCw />;

      return (
        <ButtonNode
          onClick={async () => {
            setIsLoading(true);
            await Delay(0.5);
            router.refresh();
            setIsLoading(false);
          }}
        >
          <ChildrenNode customLoader={<RefreshCw className="animate-spin" />} />
        </ButtonNode>
      );
    }

    case "scroll": {
      const { elementid, offset } = props as Extract<
        CustomType,
        { customType: "scroll" }
      >;

      return (
        <ButtonNode
          onClick={() => {
            const element = document.getElementById(elementid);
            if (!element) return;
            window.scroll({ top: element.offsetTop - (offset ?? 0) });
          }}
          required
        >
          <ChildrenNode />
        </ButtonNode>
      );
    }

    case null: {
      return (
        <ButtonNode>
          <ChildrenNode />
        </ButtonNode>
      );
    }

    default: {
      return <RequiredNode destructive />;
    }
  }
}
