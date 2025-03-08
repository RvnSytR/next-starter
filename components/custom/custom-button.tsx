"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { label } from "@/lib/content";
import { cn, Delay } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { CustomLoader } from "../icon";
import { Button, ButtonProps, buttonVariants } from "../ui/button";
import { sidebarMenuButtonVariants } from "../ui/sidebar";

// #region // * Types
type FilteredLinkProps = Omit<LinkProps, keyof ButtonProps | "href">;
type OptionalChildrenProps = { text?: string; icon?: ReactNode };
type RequiredChildrenProps =
  | { text: string; icon?: ReactNode }
  | { text?: string; icon: ReactNode };

export type CustomButtonProps = Omit<ButtonProps, "children"> &
  FilteredLinkProps &
  RequiredChildrenProps & {
    href?: string | URL;
    iconPosition?: "left" | "right";
    loading?: boolean;
    onClickLoading?: boolean;
    inSidebar?: boolean;
    hideTextOnMobile?: boolean;
    customLoader?: ReactNode;
  };

// #endregion

export function CustomButton({
  text,
  icon,
  iconPosition = "left",
  loading = false,
  onClickLoading = false,
  inSidebar = false,
  hideTextOnMobile = false,
  customLoader = <CustomLoader customType="circle" />,
  href,
  type = "button",
  variant,
  asChild = false,
  disabled = false,
  size,
  className,
  onClick,
  ...props
}: CustomButtonProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => setIsLoading(loading), [loading]);

  const ButtonNode = ({ children }: { children: ReactNode }) => {
    return (
      <Button
        type={type}
        variant={variant}
        asChild={asChild || !!href}
        disabled={disabled || isLoading}
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
          "shrink-0 truncate",
          inSidebar &&
            (sidebarMenuButtonVariants({
              size:
                size === "iconlg" ? "lg" : size === "iconsm" ? "sm" : "default",
            }),
            buttonVariants({ variant: variant })),
          className,
        )}
        onClick={async (e) => {
          if (onClickLoading) setTimeout(() => setIsLoading(true), 0);
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </Button>
    );
  };

  const ChildrenNode = () => {
    const iconNode = isLoading ? customLoader : icon;
    if (!text) return iconNode;

    return (
      <Fragment>
        {iconPosition === "left" && iconNode}
        <span
          className={cn(
            hideTextOnMobile && "hidden md:flex",
            "group-data-[collapsible=icon]:hidden",
          )}
        >
          {text}
        </span>
        {iconPosition === "right" && iconNode}
      </Fragment>
    );
  };

  return (
    <ButtonNode>
      {href ? (
        <Link href={href} {...(props as FilteredLinkProps)}>
          <ChildrenNode />
        </Link>
      ) : (
        <ChildrenNode />
      )}
    </ButtonNode>
  );
}

export function CustomRefreshButton({
  text = label.button.refresh,
  icon = <CustomLoader customType="refresh" animate={false} />,
  customLoader = <CustomLoader customType="refresh" />,
  ...props
}: OptionalChildrenProps &
  Omit<
    CustomButtonProps,
    keyof RequiredChildrenProps | "loading" | "onClick"
  >) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <CustomButton
      text={text}
      icon={icon}
      customLoader={customLoader}
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await Delay(0.5);
        router.refresh();
        setIsLoading(false);
      }}
      {...props}
    />
  );
}

// type CustomTypeProps =
//   | ((
//       | { customType: "logout" | "refresh" }
//       | { customType: "copy"; copyValue: string }
//     ) &
//       OptionalChildrenProps)
//   | ((
//       | { customType?: never }
//       | { customType: "scroll"; elementId: string; offset?: number }
//       | ({ customType: "link" } & LinkProps &
//           Omit<
//             React.AnchorHTMLAttributes<HTMLAnchorElement>,
//             keyof LinkProps & "children"
//           >)
//     ) &
//       RequiredChildrenProps);

// switch (customType) {
//   case "logout": {
//     icon = <LogOut />;
//     text = label.button.logout;
//     variant = "outline_destructive";

//     action = () => {
//       toast.promise(SignOutHandler(), {
//         loading: label.toast.loading.default,
//         success: () => {
//           router.push(path.login);
//           return label.toast.success.logout;
//         },
//         error: (e: Error) => {
//           setIsLoading(false);
//           return e.message;
//         },
//       });
//     };
//     break;
//   }

//   case "copy": {
//     icon = icon ?? <Copy />;
//     customLoader = <Check />;
//     const { copyValue, ...rest } = props as Extract<
//       CustomButtonProps,
//       { customType: "copy" }
//     >;

//     buttonProps = rest;
//     action = async () => {
//       setIsLoading(true);
//       navigator.clipboard.writeText(copyValue);
//       await Delay(1);
//       setIsLoading(false);
//     };

//     break;
//   }

//   case "scroll": {
//     const {
//       elementId,
//       offset = 80,
//       ...rest
//     } = props as Extract<CustomButtonProps, { customType: "scroll" }>;

//     buttonProps = rest;
//     action = async () => {
//       const element = document.getElementById(elementId);
//       if (!element) return;
//       window.scroll({ top: element.offsetTop - offset });
//     };

//     break;
//   }

//   case "link": {
//     withLink = true;
//     asChild = true;
//     break;
//   }
// }
