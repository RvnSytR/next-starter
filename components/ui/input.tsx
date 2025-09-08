import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function InputWrapper({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { icon: React.ReactNode }) {
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
