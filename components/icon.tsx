import { cn } from "@/lib/utils";
import {
  type LucideIcon,
  type LucideProps,
  Loader,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

type CustomLoaderProps = Omit<LucideProps, "ref"> &
  React.RefAttributes<SVGSVGElement> & {
    customType?: "circle" | "refresh" | "default";
    animate?: boolean;
  };

export const iconSize = { sm: 12, base: 16, lg: 20 };

export function CustomLoader({
  customType = "default",
  animate = true,
  className,
  ...props
}: CustomLoaderProps) {
  const LoaderComponent = (
    {
      circle: LoaderCircle,
      refresh: RefreshCw,
      default: Loader,
    } satisfies Record<Extract<CustomLoaderProps, "customType">, LucideIcon>
  )[customType];

  return (
    <LoaderComponent
      className={cn(animate && "animate-infinite animate-spin", className)}
      {...props}
    />
  );
}

export function CustomIcon({
  xmlns = "http://www.w3.org/2000/svg",
  x = 0,
  y = 0,
  customType,
  ...props
}: React.SVGAttributes<SVGSVGElement> & {
  customType: "github" | "google";
}) {
  switch (customType) {
    case "github": {
      return (
        <svg
          xmlns={xmlns}
          x={x}
          y={y}
          height={98}
          width={98}
          viewBox="0 0 98 98"
          {...props}
        >
          <path
            fill="currentColor"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />
        </svg>
      );
    }

    case "google": {
      return (
        <svg
          xmlns={xmlns}
          x={x}
          y={y}
          width="0.98em"
          height="1em"
          viewBox="0 0 256 262"
        >
          <path
            fill="#4285F4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          ></path>
          <path
            fill="#34A853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          ></path>
          <path
            fill="#FBBC05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          ></path>
          <path
            fill="#EB4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          ></path>
        </svg>
      );
    }
  }
}
