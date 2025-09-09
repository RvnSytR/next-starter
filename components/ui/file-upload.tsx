import { actions } from "@/lib/content";
import { fileMeta, FileType } from "@/lib/meta";
import { cn, toMegabytes } from "@/lib/utils";
import { zodSchemas } from "@/lib/zod";
import { Dot, X } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  DragEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
} from "react";
import { Button } from "./button";
import { FormControl } from "./form";
import { Input } from "./input";
import { Separator } from "./separator";

export type FileUploadProps = {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: FileType;
  maxSize?: number;
  className?: string;
  classNames?: { container?: string; dropzone?: string };
  multiple?: boolean;
  required?: boolean;
};

export function FileUpload({
  value,
  onChange,
  accept = "file",
  maxSize,
  className,
  classNames,
  multiple = false,
  required = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    displayName,
    mimeTypes,
    extensions,
    size,
    icon: Icon,
  } = fileMeta[accept];

  const isFiles = value.length > 0;
  const fileSize = maxSize
    ? { mb: toMegabytes(maxSize), bytes: maxSize }
    : size;

  const changeHandler = (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const fileArray = Array.from(fileList);
    if (isFiles && multiple) onChange([...value, ...fileArray]);
    else onChange(fileArray);
  };

  const removeFile = (index: number) => {
    const filteredFiles = value.filter((_, i) => i !== index);
    onChange(filteredFiles);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetFiles = useCallback(() => onChange([]), []);

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

  const handleOnDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    changeHandler(e.dataTransfer.files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnterAndOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-y-3",
        classNames?.container,
      )}
    >
      <FormControl>
        <Input
          type="file"
          tabIndex={-1}
          ref={inputRef}
          multiple={multiple}
          accept={mimeTypes.join(", ")}
          className={cn("absolute -z-1 opacity-0")}
          onChange={({ target }) => changeHandler(target.files)}
          required={required}
        />
      </FormControl>

      <div
        tabIndex={0}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        onDrop={handleOnDrop}
        onDragEnter={handleDragEnterAndOver}
        onDragOver={handleDragEnterAndOver}
        className={cn(
          "group border-input hover:border-muted-foreground dark:bg-input/30 flex flex-col items-center gap-y-2 rounded-md border border-dashed px-4 py-8 text-center transition outline-none hover:cursor-pointer",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
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

        <small className="font-medium">
          Seret dan lepaskan {displayName} di sini, atau klik untuk mengunggah
        </small>

        <small className="text-muted-foreground flex items-center text-xs">
          Maksimal {fileSize.mb} MB
          {extensions.length > 0 && (
            <>
              <Dot /> {`( ${extensions.join(" ")} )`}
            </>
          )}
        </small>
      </div>

      {isFiles && multiple && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-x-2 tabular-nums">
            <small className="font-medium capitalize">
              Total {value.length} {displayName}
            </small>
            <Separator orientation="vertical" className="h-4" />
            <small className="text-muted-foreground text-xs">
              {`${toMegabytes(
                value.reduce((acc, v) => (acc += v.size), 0),
              ).toFixed(2)} MB`}
            </small>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline_destructive"
            onClick={resetFiles}
          >
            <X /> {actions.clear}
          </Button>
        </div>
      )}

      {isFiles && (
        <div className={cn("grid gap-2 md:grid-cols-4", className)}>
          {value.map((file, index) => {
            const fileURL = URL.createObjectURL(file);
            const isImage = file.type.startsWith("image/");

            const schema = zodSchemas.file(accept, { maxSize: fileSize.bytes });
            const res = schema.safeParse([file]);

            return (
              <div key={fileURL} className="relative rounded-md border">
                <Button
                  type="button"
                  onClick={() => removeFile(index)}
                  size="icon-xs"
                  variant="destructive"
                  className="absolute -top-2 -right-2 z-10 rounded-full"
                >
                  <X />
                </Button>

                <div className="dark:bg-input/30 flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-md">
                  {isImage ? (
                    <Image
                      src={fileURL}
                      alt={file.name}
                      className="size-full object-cover object-center"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Icon />
                  )}
                </div>

                <div className="grid gap-y-1 border-t p-3 break-all *:line-clamp-1">
                  <Link
                    href={fileURL as Route}
                    target="_blank"
                    className={cn(
                      "text-sm font-medium hover:underline",
                      !res.success && "text-destructive",
                    )}
                  >
                    {file.name}
                  </Link>

                  <small
                    className={cn(
                      "text-muted-foreground text-xs",
                      !res.success && "text-destructive",
                    )}
                  >
                    {toMegabytes(file.size).toFixed(2)} MB
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
