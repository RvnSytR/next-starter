import { useIsMobile } from "@/hooks/use-mobile";
import { label, label as labelContent } from "@/lib/content";
import {
  cn,
  FormatDate,
  FormatToMegabyte,
  maxFileSize as MaxFileSize,
} from "@/lib/utils";
import { docType, imgType } from "@/lib/zod";
import { Calendar as CalendarIcon, CloudUpload, Filter } from "lucide-react";
import { ComponentProps, Dispatch, ReactNode, SetStateAction } from "react";
import type { PropsRangeRequired, PropsSingleRequired } from "react-day-picker";
import { Badge } from "../ui/badge";
import { Button, ButtonProps, buttonVariants } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";
import { Separator } from "../ui/separator";

const { byte: maxFileSizeByByte, mb: maxFileSizeByMb } = MaxFileSize;
export type CheckboxPopoverProps = {
  id: string;
  state: string[];
  setState: Dispatch<SetStateAction<string[]>>;
  icon?: ReactNode;
  arr: { value: string; length: number; icon?: ReactNode }[];
};

export function FormFloating({
  icon,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { icon: ReactNode }) {
  return (
    <div className={cn("relative h-fit [&_input]:pl-12", className)} {...props}>
      <div className="absolute inset-y-0 flex w-12 items-center justify-center">
        <small className="text-muted-foreground font-normal">{icon}</small>
      </div>
      {children}
    </div>
  );
}

export function InputRadioGroup({
  defaultValue,
  radioItems,
  ...props
}: RadioGroupProps & {
  radioItems: {
    value: string;
    label?: string;
    icon?: ReactNode;
    checkedClassName?: string;
  }[];
}) {
  return (
    <RadioGroup defaultValue={defaultValue} {...props}>
      {radioItems.map((item) => (
        <FormItem key={item.value} className="grow">
          <FormControl>
            <RadioGroupItem
              value={item.value}
              currentValue={defaultValue}
              checkedClassName={item.checkedClassName}
            >
              {item.icon}
              {item.label ?? item.value}
            </RadioGroupItem>
          </FormControl>
        </FormItem>
      ))}
    </RadioGroup>
  );
}

export function InputDate({
  selected,
  onSelect,
  label,
  ...props
}: Omit<Extract<CalendarProps, PropsSingleRequired>, "mode" | "required"> & {
  label?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(!selected && "text-muted-foreground")}
          >
            <CalendarIcon />
            {selected ? (
              FormatDate(selected, "PPPP")
            ) : (
              <span>{label ?? labelContent.button.datePicker}</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          required
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}

export function InputDateRange({
  selected,
  onSelect,
  numberOfMonths = 2,
  label,
  ...props
}: Omit<Extract<CalendarProps, PropsRangeRequired>, "mode" | "required"> & {
  label?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(!selected && "text-muted-foreground")}
        >
          <CalendarIcon />
          {selected?.from ? (
            selected.to ? (
              `${FormatDate(selected.from, "PPP")} - ${FormatDate(selected.to, "PPP")}`
            ) : (
              FormatDate(selected.from, "PPP")
            )
          ) : (
            <span>{label ?? labelContent.button.datePicker}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar
          mode="range"
          defaultMonth={selected?.from}
          selected={selected}
          onSelect={onSelect}
          numberOfMonths={numberOfMonths}
          required
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}

export function InputFile({
  value,
  accept = "img",
  maxFileSize = maxFileSizeByMb,
  className,
  placeholder,
  ...props
}: Omit<ComponentProps<"input">, "Type" | "value" | "accept"> & {
  value: FileList;
  accept?: "img" | "doc";
  maxFileSize?: number;
}) {
  const fileType = accept === "img" ? imgType : docType;
  return (
    <div
      tabIndex={0}
      className={cn(
        "border-input dark:bg-input/30 hover:border-muted-foreground relative flex flex-col items-center justify-center gap-y-6 rounded-md border border-dashed bg-transparent px-4 py-8 shadow-xs transition-[border] *:hover:cursor-pointer",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-[3px]",
        className,
      )}
    >
      <FormControl>
        <Input
          type="file"
          accept={fileType.join(", ")}
          className="absolute size-full opacity-0"
          tabIndex={-1}
          {...props}
        />
      </FormControl>

      <div className="flex flex-col items-center gap-y-1">
        <CloudUpload className="size-6" />
        <span className="text-sm">
          {placeholder ?? label.button.fileInput.placeholder}
        </span>
        <small className="text-muted-foreground font-normal">
          {label.button.fileInput.size(maxFileSize)}
        </small>
      </div>

      {value && value.length > 0 ? (
        <ul className="text-center">
          {Array.from(value).map((file, index) => (
            <li key={index}>
              <small
                className={cn(
                  file.size > maxFileSizeByByte && "text-destructive",
                )}
              >
                <span className="font-medium">{file.name}</span>
                {` - ${FormatToMegabyte(file.size).toFixed(2)} MB`}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <small>{label.button.fileInput.empty}</small>
      )}
    </div>
  );
}

export function CheckboxPopover({
  id,
  icon,
  state,
  setState,
  arr,
  size = "sm",
  variant = "outline",
  className,
}: CheckboxPopoverProps & Pick<ButtonProps, "size" | "variant" | "className">) {
  const breakpoint = useIsMobile() ? 1 : 2;
  const selectedState = new Set(state);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn("w-full capitalize select-none lg:w-auto", className)}
        >
          {icon ?? <Filter />}
          {id}
          {selectedState.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />

              <div className="space-x-1">
                {selectedState.size > breakpoint ? (
                  <Badge variant="secondary" className="rounded-sm px-1">
                    {selectedState.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedState).map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded px-1"
                    >
                      {item}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-fit flex-col gap-y-1 p-1">
        {arr.map((item, index) => {
          const { value, length: itemLength, icon } = item;
          const cbId = `cb${value}`;
          const isSelected = selectedState.has(value);

          return (
            <Label
              htmlFor={cbId}
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start gap-x-4 capitalize",
              )}
            >
              <div className="flex gap-x-3">
                <Checkbox
                  id={cbId}
                  checked={isSelected}
                  onCheckedChange={() =>
                    setState(() => {
                      if (isSelected) selectedState.delete(value);
                      else selectedState.add(value);
                      return Array.from(selectedState);
                    })
                  }
                />
                {icon}
                <small className="font-medium">{value}</small>
              </div>

              <small className="ml-auto font-medium">{itemLength}</small>
            </Label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
