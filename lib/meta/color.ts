export const allBaseColors = [
  "primary",
  // "primary-foreground",
  "secondary",
  // "secondary-foreground",
  "muted",
  // "muted-foreground",
  "accent",
  // "accent-foreground",
  "success",
  "warning",
  "destructive",
  "background",
  "foreground",
  // "card",
  // "card-foreground",
  // "popover",
  // "popover-foreground",
  // "border",
  // "input",
  // "ring",
  // "chart-1",
  // "chart-2",
  // "chart-3",
  // "chart-4",
  // "chart-5",
  // "sidebar",
  // "sidebar-foreground",
  // "sidebar-primary",
  // "sidebar-primary-foreground",
  // "sidebar-accent",
  // "sidebar-accent-foreground",
  // "sidebar-border",
  // "sidebar-ring",
] as const;

export type BaseColor = (typeof allBaseColors)[number];

export const allTailwindBaseColors = [
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

export const allTailwindShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export const allTailwindColors = allTailwindBaseColors.flatMap((color) =>
  allTailwindShades.map((shade) => `${color}-${shade}` as const),
);

export type TailwindColor = (typeof allTailwindColors)[number];
