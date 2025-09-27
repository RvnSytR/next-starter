import { cn } from "@/lib/utils";

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  shimmerWidth?: number;
}) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as React.CSSProperties}
      className={cn(
        "text-muted-foreground/75 dark:text-muted-foreground/50 mx-auto max-w-md",
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "via-primary bg-gradient-to-r from-transparent to-transparent dark:via-75%",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function AnimatedShinyDiv({
  children,
  className,
  shimmerWidth = 100,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  shimmerWidth?: number;
}) {
  return (
    <div
      style={{ "--shiny-width": `${shimmerWidth}px` } as React.CSSProperties}
      className={cn(
        "text-muted-foreground/75 dark:text-muted-foreground/50",
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "via-primary bg-gradient-to-r from-transparent to-transparent dark:via-75%",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
