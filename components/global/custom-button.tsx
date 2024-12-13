"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

import { SignOutHandler } from "@/app/login/sign";

import { cn } from "@/lib/utils";
import { Delay } from "@/lib/utils";
import { LABEL, PATH } from "../content";

import { toast } from "sonner";
import { CustomLoader } from "./icon";
import { Button, ButtonProps } from "../ui/button";
import { LogOut, RefreshCw } from "lucide-react";

// #region // * Types
type CustomType =
  | {
      customType: "loading" | "logout" | "refresh" | null | undefined;
    }
  | ({
      customType: "nav";
      href: string | URL;
    } & LinkProps)
  | ({
      customType: "pulse";
      pulseColor?: string;
    } & (LinkProps | { href?: null | undefined }))
  | {
      customType: "scroll";
      elementid: string;
      offset?: number;
    };

export type CustomButtonProps = ButtonProps &
  CustomType & {
    loadText?: string;
    iconPosition?: "left" | "right";
    icon?: ReactNode;
    children?: ReactNode;
  };
// #endregion

export function CustomButton({
  customType,
  loadText,
  iconPosition = "left",
  icon,
  children,
  ...props
}: CustomButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { success, loading, button } = LABEL;

  const ChildrenNode = (): ReactNode => {
    const loader = <CustomLoader customType="circle" />;
    const iconElement = isLoading ? loader : icon;
    const loadElement = loadText ?? children;

    return (
      <Fragment>
        {iconPosition === "left" && iconElement}
        <span className="sidebar-icon">
          {isLoading ? loadElement : children}
        </span>
        {iconPosition === "right" && iconElement}
      </Fragment>
    );
  };

  const LoadingButtonNode = ({
    children,
    ...loadingButtonProps
  }: ButtonProps & {
    children: ReactNode;
  }): ReactNode => {
    return (
      <Button
        type="button"
        onClick={() => setIsLoading(true)}
        disabled={isLoading}
        {...props}
        {...loadingButtonProps}
      >
        {children}
      </Button>
    );
  };

  switch (customType) {
    case "loading": {
      return (
        <LoadingButtonNode>
          <ChildrenNode />
        </LoadingButtonNode>
      );
    }

    case "refresh": {
      loadText = loading.refresh;
      icon = <RefreshCw className={isLoading ? "animate-spin" : ""} />;
      return (
        <Button
          type="button"
          onClick={async () => {
            setIsLoading(true);
            router.refresh();
            await Delay(0.6);
            setIsLoading(false);
          }}
          disabled={isLoading}
          {...props}
        >
          <ChildrenNode />
        </Button>
      );
    }

    case "logout": {
      loadText = loading.logout;
      children = button.logout;
      icon = <LogOut />;

      return (
        <LoadingButtonNode
          onClick={async () => {
            setIsLoading(true);
            toast.promise(SignOutHandler(), {
              loading: loading.default,
              success: () => {
                router.push(PATH.login);
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
        <LoadingButtonNode asChild>
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
          {...props}
          className={cn("relative", className)}
          asChild={!!href}
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

    case "scroll": {
      const { elementid, offset } = props as Extract<
        CustomType,
        { customType: "scroll" }
      >;

      return (
        <Button
          type="button"
          onClick={() => {
            const element = document.getElementById(elementid);
            if (!element) return;
            window.scroll({ top: element.offsetTop - (offset ?? 0) });
          }}
          {...props}
        >
          <ChildrenNode />
        </Button>
      );
    }

    case null: {
      return (
        <Button {...props}>
          {" "}
          <ChildrenNode />
        </Button>
      );
    }

    default: {
      return (
        <Button variant="destructive" disabled>
          Custom Button Undefined
        </Button>
      );
    }
  }
}
