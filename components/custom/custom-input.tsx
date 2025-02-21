import { cn, FileOnChangeAsURL, FormatDate, maxFileSize } from "@/lib/utils";
import { Calendar as CalendarIcon, CloudUpload } from "lucide-react";
import Image from "next/image";
import { Dispatch, RefObject, SetStateAction } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { iconSize } from "../icon";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormDescription } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function FormFloating({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { icon: React.ReactNode }) {
  return (
    <div className={cn("relative block", className)} {...props}>
      <small className="text-muted-foreground absolute inset-y-0 left-3.5 flex items-center font-normal">
        {icon}
      </small>
      {children}
    </div>
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
        accept="image/*"
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
        <Calendar
          mode="single"
          selected={state}
          onSelect={setState}
          initialFocus
        />
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
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
