"use client";

import { Fragment, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { useState } from "react";

// import { SignOutHandler } from "@/app/login/sign";
// import { ClientRedirect, ClientRevalidatePath } from "@/server/action";

import { cn } from "@/lib/utils";
// import { Delay } from "@/lib/utils";
// import { LABEL, PATH } from "../content";

// import { toast } from "sonner";
import { CustomLoader } from "./icon";
import { Button, ButtonProps } from "../ui/button";
// import { LogOut, RefreshCw } from "lucide-react";

// #region // * Types
type CustomType =
  | {
      customType: "loading" | "logout" | null | undefined;
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
      customType: "revalidate";
      path: string;
      type?: "layout" | "page";
    }
  | {
      customType: "scroll";
      elementId: string;
      offset?: number;
    };

type CustomButtonProps = ButtonProps &
  CustomType & {
    loadText?: string;
    iconPosition?: "left" | "right";
    icon?: ReactNode;
    children: ReactNode;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { logout, loading } = LABEL;

  const ChildrenNode = (): ReactNode => {
    const loader = <CustomLoader customType="circle" />;
    const iconElement = isLoading ? loader : icon;
    const loadElement = loadText ?? children;

    return (
      <Fragment>
        {iconPosition === "left" && iconElement}
        {isLoading ? loadElement : children}
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

    // case "logout": {
    //   loadText = loading.logout;
    //   icon = <LogOut />;

    //   return (
    //     <LoadingButtonNode
    //       onClick={async () => {
    //         setIsLoading(true);
    //         toast.promise(SignOutHandler(), {
    //           loading: loading.default,
    //           success: () => {
    //             ClientRedirect(PATH.login);
    //             return logout;
    //           },
    //           error: (e: Error) => {
    //             setIsLoading(false);
    //             return e.message;
    //           },
    //         });
    //       }}
    //     >
    //       <ChildrenNode />
    //     </LoadingButtonNode>
    //   );
    // }

    case "pulse": {
      const { className } = props;
      const {
        pulseColor = "#FAFAFA",
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

    // case "revalidate": {
    //   loadText = loading.revalidating;
    //   icon = <RefreshCw className={isLoading ? "animate-spin" : ""} />;
    //   const { path, type } = props as Extract<
    //     CustomType,
    //     { customType: "revalidate" }
    //   >;

    //   return (
    //     <Button
    //       type="button"
    //       onClick={async () => {
    //         setIsLoading(true);
    //         ClientRevalidatePath(path, type);
    //         await Delay(0.6);
    //         setIsLoading(false);
    //       }}
    //       disabled={isLoading}
    //       {...props}
    //     >
    //       <ChildrenNode />
    //     </Button>
    //   );
    // }

    case "scroll": {
      const { elementId, offset } = props as Extract<
        CustomType,
        { customType: "scroll" }
      >;

      return (
        <Button
          type="button"
          onClick={() => {
            const element = document.getElementById(elementId);
            if (!element) return;
            window.scroll({ top: element.offsetTop - (offset ?? 0) });
          }}
          {...props}
        >
          {children}
        </Button>
      );
    }

    case null: {
      return <Button {...props}>{children}</Button>;
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
