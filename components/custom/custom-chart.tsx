"use client";

import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export type ChartPieData = { nameKey: string; dataKey: number; fill?: string };

const radius = 8;
const tickMargin = 10;
const tickFormater = (str: string) => str.slice(0, 3);

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
        "[&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000 [&_.recharts-pie-label-text]:hidden md:[&_.recharts-pie-label-text]:flex",
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
              className="animate-fade animate-delay-1000 flex-wrap gap-y-2"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}

export function ChartArea({
  config,
  data,
}: {
  config: ChartConfig;
  data: { label: string; key1: number; key2: number }[];
}) {
  // TODO : Dynamic Keys
  return (
    <ChartContainer config={config}>
      <AreaChart accessibilityLayer data={data} margin={{ left: 10 }}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={tickFormater}
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
          fill="url(#fill1)"
          fillOpacity={0.4}
          stroke="var(--color-key1)"
        />

        <Area
          dataKey="key2"
          fill="url(#fill2)"
          fillOpacity={0.4}
          stroke="var(--color-key2)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function ChartBar({
  config,
  data,
}: {
  config: ChartConfig;
  data: { label: string; key: number }[];
}) {
  return (
    <ChartContainer config={config}>
      <BarChart accessibilityLayer data={data} margin={{ top: 30 }}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={tickFormater}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <Bar dataKey="key" fill="var(--color-key)" radius={radius}>
          <LabelList className="fill-foreground" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
