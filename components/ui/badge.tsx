import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground",

        success:
          "border-transparent bg-green-400 text-green-50 dark:bg-green-700",
        warning:
          "border-transparent bg-yellow-400 text-yellow-50 dark:bg-yellow-700",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",

        outline_success:
          "border-green-400 text-green-400 dark:border-green-700 dark:text-green-700",
        outline_warning:
          "border-yellow-400 text-yellow-400 dark:border-yellow-700 dark:text-yellow-700",
        outline_destructive: "border-destructive text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
