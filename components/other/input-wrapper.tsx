import { cn } from "@/lib/utils";

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
