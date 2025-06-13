"use client";

import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  currentValue,
  checkedClassName,
  type = "button",
  value,
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  currentValue?: string;
  checkedClassName?: string;
}) {
  const isChecked = currentValue === value;
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      type={type}
      value={value}
      className={cn(
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 border shadow-xs transition-[border,color,box-shadow] outline-none hover:cursor-pointer focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        children
          ? "dark:bg-input/30 text-foreground flex h-9 items-center justify-center gap-2 rounded-md bg-transparent px-4 text-sm"
          : "text-primary aspect-square size-4 shrink-0 rounded-full",

        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        isChecked
          ? "border-foreground text-foreground aria-invalid:text-destructive aria-invalid:border-destructive"
          : "aria-invalid:text-destructive/50 aria-invalid:border-destructive/50",

        isChecked && checkedClassName,
        className,
      )}
      {...props}
    >
      {children ?? (
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="relative flex items-center justify-center"
        >
          <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
        </RadioGroupPrimitive.Indicator>
      )}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupProps };
