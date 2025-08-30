export const allBaseColors = [
  "success",
  "warning",
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

export type BaseColor = (typeof allBaseColors)[number];

export const baseColorMeta: Record<BaseColor, string> = Object.fromEntries(
  allBaseColors.map((c) => [c, `var(--${c})`]),
) as Record<BaseColor, string>;

export const allTailwindColors = [
  "neutral",
  "stone",
  "zinc",
  "slate",
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;
const allTailwindShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type TailwindColor =
  `${(typeof allTailwindColors)[number]}-${(typeof allTailwindShades)[number]}`;

export const tailwindColorMeta: Record<TailwindColor, string> =
  Object.fromEntries(
    allTailwindColors.flatMap((c) =>
      allTailwindShades.map((s) => {
        const key: TailwindColor = `${c}-${s}`;
        return [key, `var(--color-${key})`];
      }),
    ),
  ) as Record<TailwindColor, string>;
