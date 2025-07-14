import { FileType, mediaMeta } from "@/lib/const";
import { buttonText, commonText } from "@/lib/content";
import { cn, formatDate, toByte, toMegabytes } from "@/lib/utils";
import { Calendar as CalendarIcon, Dot, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ComponentProps,
  DragEvent,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { Button } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";
import { Separator } from "../ui/separator";

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
        "relative h-fit [&_svg:not([class*='size-'])]:size-4",
        extraPadding ? "[&_input]:pl-11" : "[&_input]:pl-9",
        className,
      )}
      {...props}
    >
      <div className="text-muted-foreground absolute inset-y-0 flex items-center justify-center pl-3 text-center text-sm">
        {typeof icon === "string" ? icon.slice(0, 3) : icon}
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
  placeholder = buttonText.datePicker.single,
  ...props
}: CalendarProps & { placeholder?: string }) {
  let isSelected = false;

  if (props.mode) {
    const { mode, selected } = props;
    placeholder = buttonText.datePicker[mode];

    if (selected) isSelected = true;
    if (mode === "single" && selected) {
      placeholder = formatDate(selected, "PPPP");
    } else if (mode === "multiple" && selected) {
      const maxDisplay = 2;
      const formattedDates = selected.map((date) => formatDate(date, "PPP"));

      if (selected.length <= maxDisplay) {
        placeholder = formattedDates.join(", ");
      } else {
        placeholder = `${formattedDates.slice(0, maxDisplay).join(", ")} +${selected.length - maxDisplay} ${commonText.more}`;
      }
    } else if (mode === "range" && selected && selected.from) {
      placeholder = selected.to
        ? `${formatDate(selected.from, "PPP")} - ${formatDate(selected.to, "PPP")}`
        : formatDate(selected.from, "PPP");
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(!isSelected && "text-muted-foreground")}
          >
            <CalendarIcon /> {placeholder}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar {...props} />
      </PopoverContent>
    </Popover>
  );
}

export function InputFile({
  value: files,
  onChange,
  accept = "file",
  maxFileSize: size,
  className,
  placeholder,
  multiple = false,
}: Pick<ComponentProps<"input">, "className" | "placeholder" | "multiple"> & {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: FileType;
  maxFileSize?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileMedia = mediaMeta[accept];
  const fileSize = size ? { mb: size, byte: toByte(size) } : fileMedia.size;
  const isFiles = files.length > 0;
  const Icon = fileMedia.icon;

  const resetFiles = () => onChange([]);

  const removeFile = (fileIndex: number) => {
    const filteredFiles = files.filter((_, index) => index !== fileIndex);
    onChange(filteredFiles);
  };

  const changeHandler = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    if (isFiles) onChange([...files, ...newFiles]);
    else onChange(newFiles.map((f) => f));
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        "border-input dark:bg-input/30 relative rounded-md border bg-transparent shadow-xs transition-[border]",
        "group focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-[3px]",
        !isFiles && "hover:border-foreground hover:cursor-pointer",
        className,
      )}
    >
      <FormControl>
        <Input
          type="file"
          tabIndex={-1}
          ref={inputRef}
          multiple={multiple}
          accept={fileMedia.mimeType.join(", ")}
          className={cn(
            "absolute size-full opacity-0 group-hover:cursor-pointer",
            isFiles ? "-z-1" : "z-0",
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
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>Total {`${accept}s : ${files.length}`}</p>

            <div className="flex gap-x-2 *:grow">
              <Button
                type="button"
                variant="outline_destructive"
                className="h-8"
                onClick={resetFiles}
              >
                <X />
                {buttonText.clear}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8"
                onClick={() => {
                  if (inputRef.current) inputRef.current.click();
                }}
              >
                <Upload /> Add {accept}
              </Button>
            </div>
          </div>

          <Separator className="flex md:hidden" />

          <div
            className={cn(
              multiple
                ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
                : "flex justify-center",
            )}
          >
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const isInvalid =
                file.size > fileSize.byte ||
                (!fileMedia.mimeType.includes("*") &&
                  !fileMedia.mimeType.includes(file.type));

              const url = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex flex-col rounded-md border shadow-xs",
                    !multiple && "max-w-1/2 md:max-w-1/4 lg:max-w-1/6",
                  )}
                >
                  <Button
                    type="button"
                    onClick={() => removeFile(index)}
                    size="iconsm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 size-5 rounded-full"
                  >
                    <X />
                  </Button>

                  {isImage ? (
                    <Image
                      src={url}
                      alt={file.name}
                      className="aspect-square size-full rounded-t-md object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="bg-accent flex aspect-square size-full items-center justify-center rounded-t-md">
                      <Icon className="size-5" />
                    </div>
                  )}

                  <div className="text-muted-foreground flex flex-col items-start gap-0.5 border-t p-2.5 break-all">
                    <Link
                      href={url}
                      target="_blank"
                      className={cn(
                        "line-clamp-1 text-sm font-medium",
                        isInvalid
                          ? "text-destructive"
                          : "hover:text-foreground",
                      )}
                    >
                      {file.name}
                    </Link>
                    <small
                      className={cn(
                        "line-clamp-1 text-xs",
                        isInvalid && "text-destructive",
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
        <div className="flex flex-col items-center gap-y-4 px-4 pt-8 pb-10 text-center">
          <div className="group-hover:text-foreground group-hover:border-muted-foreground group-focus:border-muted-foreground text-muted-foreground rounded-full border p-3 transition">
            <Icon />
          </div>

          <div className="flex flex-col items-center gap-y-2">
            <small className="font-medium">
              {placeholder ??
                buttonText.fileInput.placeholder(accept, multiple)}
            </small>

            <small className="text-muted-foreground flex items-center text-xs">
              {buttonText.fileInput.size(fileSize.mb)}
              {fileMedia.extensions.length > 0 && (
                <>
                  <Dot />
                  {`( ${fileMedia.extensions.join(" ")} )`}
                </>
              )}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
