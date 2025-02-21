import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 cursor-default [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",

        success:
          "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90",
        outline_success: "border-success text-success hover:bg-success/10",

        warning:
          "border-transparent bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
        outline_warning: "border-warning text-warning hover:bg-warning/10",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline_destructive:
          "border-destructive text-destructive hover:bg-destructive/10",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
