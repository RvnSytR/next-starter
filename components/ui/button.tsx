import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",

        success:
          "bg-success text-success-foreground shadow-xs hover:bg-success/90",
        outline_success:
          "border border-success text-success shadow-xs hover:bg-success hover:text-success-foreground",

        warning:
          "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90",
        outline_warning:
          "border border-warning text-warning shadow-xs hover:bg-warning hover:text-warning-foreground",

        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline_destructive:
          "border border-destructive text-destructive shadow-xs hover:bg-destructive hover:text-destructive-foreground",

        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        icon: "size-9",

        sm: "h-8 rounded-md px-3",
        iconsm: "size-8 rounded-md",

        lg: "h-10 rounded-md px-6",
        iconlg: "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
