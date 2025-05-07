import { label, label as labelContent } from "@/lib/content";
import { maxFileSize, Media, media } from "@/lib/media";
import { cn, formatDate, formatToByte, formatToMegabyte } from "@/lib/utils";
import { Calendar as CalendarIcon, CloudUpload } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { PropsRangeRequired, PropsSingleRequired } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";

export function FormFloating({
  icon,
  extraPadding = false,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  icon: ReactNode;
  extraPadding?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-fit [&_input]:pl-9 [&_svg:not([class*='size-'])]:size-4",
        extraPadding ? "[&_input]:pl-11" : "[&_input]:pl-9",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-y-0 flex items-center justify-center pl-3 text-center">
        <small className="text-muted-foreground">
          {typeof icon === "string" ? icon.slice(0, 3) : icon}
        </small>
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
    className?: string;
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
              className={item.className}
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
              formatDate(selected, "PPPP")
            ) : (
              <span>{label ?? labelContent.button.datePicker}</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar mode="single" required selected={selected} {...props} />
      </PopoverContent>
    </Popover>
  );
}

export function InputDateRange({
  selected,
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
              `${formatDate(selected.from, "PPP")} - ${formatDate(selected.to, "PPP")}`
            ) : (
              formatDate(selected.from, "PPP")
            )
          ) : (
            <span>{label ?? labelContent.button.datePicker}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar
          mode="range"
          required
          selected={selected}
          defaultMonth={selected?.from}
          numberOfMonths={numberOfMonths}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}

export function InputFile({
  value,
  onChange,
  accept = "all",
  maxFileSize: size,
  className,
  placeholder,
  ...props
}: Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "accept" | "tabIndex"
> & {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: Media | "all";
  maxFileSize?: number;
}) {
  const fileMedia = media[accept];
  const fileSize = size
    ? { mb: size, byte: formatToByte(size) }
    : maxFileSize[accept];

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
          tabIndex={-1}
          className="absolute size-full opacity-0"
          accept={fileMedia.type.join(", ")}
          onChange={(e) => {
            const fileList = e.target.files;
            if (fileList) onChange(Array.from(fileList).map((file) => file));
          }}
          {...props}
        />
      </FormControl>

      <div className="flex flex-col items-center gap-y-1 text-sm">
        <CloudUpload className="size-6" />

        <span className="font-medium">
          {placeholder ?? label.button.fileInput.placeholder}
        </span>

        <small className="text-muted-foreground">
          {label.button.fileInput.size(fileSize.mb)}
        </small>

        {fileMedia.extensions.length > 0 && (
          <small className="text-muted-foreground text-xs">
            {`( ${fileMedia.extensions.join(" ")} )`}
          </small>
        )}
      </div>

      {value && value.length > 0 ? (
        <ul className="text-center">
          {value.map((file, index) => (
            <li key={index}>
              <small
                className={cn(
                  "font-medium",
                  (file.size > fileSize.byte ||
                    !fileMedia.type.includes(file.type)) &&
                    "text-destructive",
                )}
              >
                {`${file.name} - ${formatToMegabyte(file.size).toFixed(2)} MB`}
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
