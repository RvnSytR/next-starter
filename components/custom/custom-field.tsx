import { FileCategory, mediaMetadata } from "@/lib/const";
import { buttonText } from "@/lib/content";
import { cn, formatDate, toByte, toMegabytes } from "@/lib/utils";
import { Calendar as CalendarIcon, Dot, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  ComponentProps,
  DragEvent,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { PropsRangeRequired, PropsSingleRequired } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { CardTitle } from "../ui/card";
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
              <span>{label ?? buttonText.datePicker}</span>
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
            <span>{label ?? buttonText.datePicker}</span>
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
  value: files,
  onChange,
  accept = "all",
  maxFileSize: size,
  className,
  placeholder,
  multiple = false,
}: Pick<ComponentProps<"input">, "className" | "placeholder" | "multiple"> & {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: FileCategory;
  maxFileSize?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileMedia = mediaMetadata[accept];
  const fileSize = size ? { mb: size, byte: toByte(size) } : fileMedia.size;
  const isFiles = files.length > 0;
  const Icon = fileMedia.icon;

  const resetFiles = () => onChange([]);

  const removeFile = (fileIndex: number) => {
    const filteredFiles = files.filter((_, index) => index !== fileIndex);
    onChange(filteredFiles);
  };

  const changeHandler = (fileList: FileList | null) => {
    const newFileList = fileList;
    if (newFileList) {
      const newFiles = Array.from(newFileList);
      if (isFiles) onChange([...files, ...newFiles]);
      else onChange(newFiles.map((f) => f));
    }
  };

  const handleDragEnterAndOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
  }, []);

  return (
    <div
      tabIndex={0}
      className={cn(
        "border-input dark:bg-input/30 relative rounded-md border border-dashed bg-transparent shadow-xs transition-[border]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-[3px]",
        !isFiles && "hover:border-muted-foreground hover:cursor-pointer",
        className,
      )}
    >
      <FormControl>
        <Input
          type="file"
          tabIndex={-1}
          ref={inputRef}
          multiple={multiple}
          accept={fileMedia.type.join(", ")}
          className={cn(
            "absolute size-full opacity-0",
            isFiles ? "z-[-1]" : "z-0",
          )}
          onChange={({ target }) => changeHandler(target.files)}
        />
      </FormControl>

      {isFiles ? (
        <div
          onDragEnter={handleDragEnterAndOver}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnterAndOver}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            changeHandler(e.dataTransfer.files);
          }}
          className="flex flex-col gap-y-4 p-4"
        >
          <div className="flex items-center justify-between gap-x-2">
            <CardTitle>Total Files: {files.length}</CardTitle>

            <div className="flex gap-x-2">
              <Button
                type="button"
                variant="outline"
                className="h-8"
                onClick={() => {
                  if (inputRef.current) inputRef.current.click();
                }}
              >
                <Upload />
                Add {accept === "all" ? "files" : accept}
              </Button>
              <Button
                type="button"
                variant="outline_destructive"
                className="h-8"
                onClick={resetFiles}
              >
                <Trash2 />
                {buttonText.remove} all
              </Button>
            </div>
          </div>

          <div
            className={cn(
              multiple
                ? "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6"
                : "flex justify-center",
            )}
          >
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const isInvalid =
                file.size > fileSize.byte ||
                (!fileMedia.type.includes("*") &&
                  !fileMedia.type.includes(file.type));

              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex flex-col rounded-md border shadow-xs",
                    !multiple && "max-w-1/2 md:max-w-1/4 lg:max-w-1/6",
                    isInvalid && "border-destructive",
                  )}
                >
                  <Button
                    type="button"
                    onClick={() => removeFile(index)}
                    size="iconsm"
                    variant="outline_destructive"
                    className="bg-background/50 absolute -top-2.5 -right-2.5 size-6 rounded-full"
                  >
                    <X />
                  </Button>

                  {isImage ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="aspect-square size-full rounded-t-md object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="bg-accent flex aspect-square size-full items-center justify-center">
                      <div className="rounded-full border p-3">
                        <Icon />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 border-t p-3">
                    <small
                      className={cn(
                        "truncate font-medium",
                        isInvalid && "text-destructive",
                      )}
                    >
                      {file.name}
                    </small>
                    <small
                      className={cn(
                        "truncate text-xs",
                        isInvalid
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {toMegabytes(file.size).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 px-4 py-8">
          <div className="rounded-full border p-3">
            <Icon />
          </div>

          <div className="flex flex-col items-center gap-y-1 text-center">
            <small className="font-medium">
              {placeholder ?? buttonText.fileInput.placeholder}
            </small>

            <small className="text-muted-foreground flex items-center text-xs">
              {buttonText.fileInput.size(fileSize.mb)}
              <Dot />
              {fileMedia.extensions.length > 0 &&
                `( ${fileMedia.extensions.join(" ")} )`}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
