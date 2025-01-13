"use client";

import Image from "next/image";

import { cn, FileOnChangeAsURL, maxFileSize } from "@/lib/utils";
import { iconSize } from "./icon";

import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormDescription } from "../ui/form";
import { ImageIcon } from "lucide-react";

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

export function FormFileInput({
  label,
  state,
  setState,
  ref,
  disabled = false,
}: {
  label: string;
  state: string | null;
  setState: React.Dispatch<React.SetStateAction<string | null>>;
  ref: React.RefObject<HTMLInputElement>;
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
