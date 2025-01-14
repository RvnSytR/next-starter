"use client";

import Image from "next/image";
import { Dispatch, RefObject, SetStateAction } from "react";

import { format } from "date-fns";
import { cn, FileOnChangeAsURL, maxFileSize } from "@/lib/utils";
import { iconSize } from "./icon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormDescription } from "../ui/form";
import { ImageIcon, Calendar as CalendarIcon } from "lucide-react";

export function FormFloating({
  icon,
  className,
  children,
}: {
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative block", className)}>
      <small className="absolute inset-y-0 left-3.5 flex items-center font-normal text-muted-foreground">
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
              "max-h-[32rem] w-auto max-w-[32rem] overflow-hidden rounded-md border-muted-foreground",
              !disabled ? "hover:cursor-pointer hover:border" : "",
            )}
          >
            <Image
              src={state}
              width={960}
              height={960}
              alt="Bukti Approval"
              className="rounded-md object-center transition hover:scale-125"
              onClick={() => {
                if (!disabled) ref.current?.click();
              }}
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-[10rem] w-[15rem] items-center justify-center rounded border opacity-25 outline-dashed outline-2 transition",
              !disabled ? "hover:cursor-pointer hover:opacity-100" : "",
            )}
            onClick={() => {
              if (!disabled) ref.current?.click();
            }}
          >
            <ImageIcon size={iconSize.lg} />
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
}: {
  state: Date | undefined;
  setState: Dispatch<SetStateAction<Date | undefined>>;
  label?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex w-full", !state && "text-muted-foreground")}
        >
          <CalendarIcon size={iconSize.sm} />
          {state ? format(state, "PPP") : <span>{label ?? "Pick a date"}</span>}
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
