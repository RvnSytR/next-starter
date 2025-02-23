import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",

        success:
          "bg-success text-success-foreground shadow-xs hover:bg-success/90  focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        outline_success:
          "border-success bg-background text-success border shadow-xs hover:bg-success hover:text-success-foreground focus-visible:border-success focus-visible:ring-success/20 dark:focus-visible:ring-success/40",

        warning:
          "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        outline_warning:
          "border-warning bg-background text-warning border shadow-xs hover:bg-warning hover:text-warning-foreground focus-visible:border-warning focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",

        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline_destructive:
          "border-destructive bg-background text-destructive border shadow-xs hover:bg-destructive hover:text-destructive-foreground focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",

        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",

        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        iconsm: "size-8 rounded",

        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
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
