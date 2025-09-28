"use client";

import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { ComponentProps } from "react";
import { FormControl, FormItem, FormLabel } from "./form";
import { IconOrText } from "./icons";

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>;
type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item> & {
  classNames?: { inidicator?: string; circle?: string };
};

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex gap-2", className)}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  classNames,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "relative flex items-center justify-center",
          classNames?.inidicator,
        )}
      >
        <CircleIcon
          className={cn(
            "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
            classNames?.circle,
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export function RadioGroupField({
  data,
  ...props
}: RadioGroupProps & {
  data: {
    value: string;
    key?: string;
    label?: string;
    desc?: React.ReactNode;
    icon?: IconOrText;
    color?: string;
    className?: string;
    classNames?: {
      header?: string;
      label?: string;
      radioItem?: string;
      desc?: string;
    };
    disabled?: boolean;
  }[];
}) {
  return (
    <RadioGroup {...props}>
      {data.map(({ icon: Icon, ...item }) => (
        <FormItem
          key={item.key ?? item.value}
          style={
            {
              "--radio-color": item.color ?? "var(--primary)",
            } as React.CSSProperties
          }
          className={cn(
            "dark:bg-input/30 border-input relative items-start rounded-md border p-4 shadow-xs has-data-[state=checked]:border-[var(--radio-color)]",
            item.disabled && "opacity-50",
            item.className,
          )}
        >
          <div
            className={cn(
              "flex w-full justify-between gap-x-2 has-data-[state=checked]:[&>label]:text-[var(--radio-color)]",
              item.classNames?.header,
            )}
          >
            <FormLabel
              className={cn("flex items-center", item.classNames?.label)}
            >
              {Icon && (typeof Icon === "string" ? Icon : <Icon />)}
              {item.label ?? item.value}
            </FormLabel>

            <FormControl>
              <RadioGroupItem
                value={item.value}
                className={cn(
                  "after:absolute after:inset-0 has-data-[state=checked]:border-[var(--radio-color)]",
                  item.classNames?.radioItem,
                )}
                classNames={{ circle: "fill-[var(--radio-color)]" }}
                disabled={item.disabled}
              />
            </FormControl>
          </div>

          {item.desc && (
            <span
              className={cn(
                "text-muted-foreground text-xs text-pretty",
                item.classNames?.desc,
              )}
            >
              {item.desc}
            </span>
          )}
        </FormItem>
      ))}
    </RadioGroup>
  );
}
