import { FileType } from "@/lib/const";
import { buttonText, getFileInputMetaAndText } from "@/lib/content";
import { cn, toByte, toMegabytes } from "@/lib/utils";
import { Dot, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ComponentProps,
  DragEvent,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { Button } from "../ui/button";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";

export function InputWrapper({
  icon,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  icon: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative h-fit [&_input:not([class*='pl-'])]:pl-9 [&_svg:not([class*='size-'])]:size-4",
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

export function InputFile({
  value: files,
  onChange,
  accept = "file",
  maxFileSize: sizeProp,
  classNames,
  placeholder,
  multiple = false,
}: Pick<ComponentProps<"input">, "placeholder" | "multiple"> & {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: FileType;
  maxFileSize?: number;
  classNames?: { container?: string; dropzone?: string; files?: string };
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { meta, text } = getFileInputMetaAndText(accept);
  const Icon = meta.icon;
  const isFiles = files.length > 0;
  const fileSize = sizeProp
    ? { mb: sizeProp, byte: toByte(sizeProp) }
    : meta.size;

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

  const handleOnDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    changeHandler(e.dataTransfer.files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  }, []);

  const handleOnKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  return (
    <div className={cn("flex w-full flex-col gap-y-3", classNames?.container)}>
      <FormControl>
        <Input
          type="file"
          tabIndex={-1}
          ref={inputRef}
          multiple={multiple}
          accept={meta.mimeType.join(", ")}
          className={cn("absolute -z-1 opacity-0")}
          onChange={({ target }) => changeHandler(target.files)}
        />
      </FormControl>

      <div
        tabIndex={0}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        onDrop={handleOnDrop}
        onDragEnter={handleDragEnterAndOver}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnterAndOver}
        className={cn(
          "group border-input flex flex-col items-center gap-y-2 rounded-md border border-dashed px-4 py-8 text-center outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 hover:cursor-pointer focus-visible:ring-[3px]",
          classNames?.dropzone,
        )}
      >
        <div
          className={cn(
            "text-muted-foreground rounded-full border p-3 transition",
            "group-hover:text-foreground group-hover:border-muted-foreground group-focus:text-foreground group-focus:border-muted-foreground",
          )}
        >
          <Icon />
        </div>

        <div className="flex flex-col items-center gap-y-2">
          <small className="font-medium">
            {placeholder ?? text.placeholder(multiple)}
          </small>

          <small className="text-muted-foreground flex items-center text-xs">
            {text.size(fileSize.mb)}
            {meta.extensions.length > 0 && (
              <>
                <Dot /> {`( ${meta.extensions.join(" ")} )`}
              </>
            )}
          </small>
        </div>
      </div>

      {isFiles && (
        <Fragment>
          <div className="flex items-center justify-between gap-2">
            {multiple && <p>{text.total(files.length)}</p>}

            <Button
              type="button"
              size="sm"
              variant="outline_destructive"
              onClick={resetFiles}
            >
              <X /> {buttonText.clear}
            </Button>
          </div>

          <div className={cn("grid gap-2 md:grid-cols-4", classNames?.files)}>
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              const isImage = file.type.startsWith("image/");
              const isInvalid =
                file.size > fileSize.byte ||
                (accept !== "file" && !meta.mimeType.includes(file.type));

              return (
                <div key={index} className="relative rounded-md border">
                  <Button
                    type="button"
                    onClick={() => removeFile(index)}
                    size="iconxs"
                    variant="destructive"
                    className="absolute -top-2 -right-2 z-10 rounded-full"
                  >
                    <X />
                  </Button>

                  <div className="bg-muted flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-md">
                    {isImage ? (
                      <Image
                        src={url}
                        alt={file.name}
                        className="size-full object-cover transition-transform"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <Icon />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 border-t p-3 break-all *:line-clamp-1">
                    <Link
                      href={url}
                      target="_blank"
                      className={cn(
                        "text-sm font-medium hover:underline",
                        isInvalid && "text-destructive",
                      )}
                    >
                      {file.name}
                    </Link>
                    <small
                      className={cn(
                        "text-muted-foreground text-xs",
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
        </Fragment>
      )}
    </div>
  );
}
