"use client";

import { Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { cn } from "@/lib/utils";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type ChartPieData = {
  nameKey: string;
  dataKey: number;
  fill?: string;
};

export function ChartPie({
  config,
  data,
}: {
  config: ChartConfig;
  data: ChartPieData[];
}) {
  return (
    <ChartContainer
      config={config}
      className={cn(
        "aspect-square",
        "[&_.recharts-pie-label-text]:hidden [&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000 md:[&_.recharts-pie-label-text]:flex",
      )}
    >
      <PieChart>
        <Pie
          data={data}
          nameKey="nameKey"
          dataKey="dataKey"
          innerRadius={40}
          label
          labelLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="nameKey"
              className="animate-fade flex-wrap gap-y-2 animate-delay-1000"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}

export function ChartArea() {
  // {
  //   config,
  //   data,
  // }: {
  //   config: ChartConfig;
  //   data: { nameKey: string; dataKey: number; fill?: string }[];
  // }
  const data = [
    { label: "January", key1: 100, key2: 50 },
    { label: "February", key1: 305, key2: 200 },
    { label: "March", key1: 237, key2: 120 },
    { label: "April", key1: 73, key2: 190 },
    { label: "May", key1: 209, key2: 130 },
    { label: "June", key1: 214, key2: 140 },
  ];

  const config = {
    key1: { label: "Pengajuan", color: "hsl(var(--chart-1))" },
    key2: { label: "Pemasukan", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config}>
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-key1)" stopOpacity={0.8} />
            <stop
              offset="95%"
              stopColor="var(--color-key1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-key2)" stopOpacity={0.8} />
            <stop
              offset="95%"
              stopColor="var(--color-key2)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="key1"
          type="natural"
          fill="url(#fill1)"
          fillOpacity={0.4}
          stroke="var(--color-key1)"
        />

        <Area
          dataKey="key2"
          type="natural"
          fill="url(#fill2)"
          fillOpacity={0.4}
          stroke="var(--color-key2)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
