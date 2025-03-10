import { useIsMobile } from "@/hooks/use-mobile";
import { cn, FileOnChangeAsURL, FormatDate, maxFileSize } from "@/lib/utils";
import { Calendar as CalendarIcon, CloudUpload, Filter } from "lucide-react";
import Image from "next/image";
import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { iconSize } from "../icon";
import { Badge } from "../ui/badge";
import { Button, ButtonProps, buttonVariants } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormDescription, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";
import { Separator } from "../ui/separator";

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
}: React.ComponentProps<"div"> & { icon: React.ReactNode }) {
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
  className,
  radioItems,
  ...props
}: RadioGroupProps & {
  radioItems: {
    value: string;
    label: string;
    icon?: ReactNode;
    checkedClassName?: string;
  }[];
}) {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      className={cn("flex-wrap", className)}
      {...props}
    >
      {radioItems.map((item) => (
        <FormItem key={item.value} className="grow">
          <FormControl>
            <RadioGroupItem
              value={item.value}
              currentValue={defaultValue}
              checkedClassName={item.checkedClassName}
            >
              {item.icon}
              {item.label}
            </RadioGroupItem>
          </FormControl>
        </FormItem>
      ))}
    </RadioGroup>
  );
}

export function InputFile({
  label,
  state,
  setState,
  ref,
  disabled = false,
}: {
  label: string;
  state: string | null;
  setState: Dispatch<SetStateAction<string | null>>;
  ref: RefObject<HTMLInputElement>;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="file" className={disabled ? "text-muted-foreground" : ""}>
        {label}
      </Label>

      <div className="flex justify-center rounded-md border p-4">
        {state ? (
          <div
            className={cn(
              "group border-muted-foreground flex size-fit max-h-[36rem] grow justify-center overflow-hidden rounded-md border-dashed",
              !disabled ? "hover:cursor-pointer hover:border" : "",
            )}
          >
            <Image
              src={state}
              width={960}
              height={960}
              alt="Bukti Approval"
              className="rounded-md object-contain object-center transition group-hover:scale-105"
              onClick={() => {
                if (!disabled) ref.current?.click();
              }}
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-[12rem] w-full flex-col items-center justify-center gap-y-2 rounded-md border opacity-25 outline-1 transition outline-dashed md:w-[18rem]",
              !disabled ? "hover:cursor-pointer hover:opacity-100" : "",
            )}
            onClick={() => {
              if (!disabled) ref.current?.click();
            }}
          >
            <CloudUpload size={iconSize.lg} />
            <small className="text-xs font-medium">Upload File</small>
          </div>
        )}
      </div>

      <Input
        type="file"
        id="file"
        name="file"
        ref={ref}
        onChange={async (event) => {
          try {
            setState((await FileOnChangeAsURL(event))[0]);
          } catch (error) {
            if (error instanceof Error) toast.error(error.message);
          }
        }}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      <FormDescription>
        * Maksimal file berukuran {maxFileSize.mb}MB
      </FormDescription>
    </div>
  );
}

export function InputDatePicker({
  state,
  setState,
  label,
  className,
}: {
  state: Date | undefined;
  setState: Dispatch<SetStateAction<Date | undefined>>;
  label?: string;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex w-full",
            !state && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon />
          {state ? (
            FormatDate(state, "PPPP")
          ) : (
            <span>{label ?? "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-0">
        <Calendar mode="single" selected={state} onSelect={setState} />
      </PopoverContent>
    </Popover>
  );
}

export function InputDateRangePicker({
  state,
  setState,
  label,
  align = "center",
  className,
  disabled = false,
}: {
  state: DateRange | undefined;
  setState: Dispatch<SetStateAction<DateRange | undefined>>;
  label?: string;
  align?: "center" | "end" | "start";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full", !state && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <CalendarIcon />
          {state?.from ? (
            state.to ? (
              `${FormatDate(state.from, "PPP")} - ${FormatDate(state.to, "PPP")}`
            ) : (
              FormatDate(state.from, "PPP")
            )
          ) : (
            <span>{label ?? "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-0" align={align}>
        <Calendar
          mode="range"
          defaultMonth={state?.from}
          selected={state}
          onSelect={setState}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
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
