"use client";

import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart as AreaChartComp,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart as PieChartComp,
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

const radius = 8;
const tickMargin = 10;
const tickFormatter = (str: string) => str.slice(0, 3);

export function PieChart({
  label,
  data,
}: {
  label: string;
  data: { nameKey: string; dataKey: number; fill: string }[];
}) {
  return (
    <ChartContainer
      config={{
        dataKey: { label: label },
        ...data.reduce(
          (acc, item) => {
            acc[item.nameKey] = { label: item.nameKey };
            return acc;
          },
          {} as Record<string, { label: string }>,
        ),
      }}
      className={cn(
        "aspect-square",
        "[&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000 [&_.recharts-pie-label-text]:hidden md:[&_.recharts-pie-label-text]:flex",
        "[&_.recharts-pie-label-line]:animate-fade [&_.recharts-pie-label-line]:animate-delay-1250 [&_.recharts-pie-label-line]:hidden md:[&_.recharts-pie-label-line]:flex",
      )}
    >
      <PieChartComp>
        <Pie
          data={data}
          nameKey="nameKey"
          dataKey="dataKey"
          innerRadius={40}
          label
        />
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="nameKey"
              className="animate-fade animate-delay-1000 flex-wrap gap-y-2"
            />
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChartComp>
    </ChartContainer>
  );
}

export function AreaChart({
  config,
  data,
}: {
  config: ChartConfig;
  data: { xLabel: string; data: Record<string, number> }[];
}) {
  return (
    <ChartContainer config={config}>
      <AreaChartComp
        accessibilityLayer
        margin={{ left: 12, right: 12 }}
        data={data.map((item) => ({ xLabel: item.xLabel, ...item.data }))}
      >
        <defs>
          {Object.keys(config).map((item) => (
            <linearGradient
              key={item}
              id={`fill-${item}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${item})`}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${item})`}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>

        {Object.keys(config).map((item) => (
          <Area
            key={item}
            dataKey={item}
            fill={`url(#fill-${item})`}
            stroke={`var(--color-${item})`}
            fillOpacity={0.4}
          />
        ))}

        <XAxis
          dataKey="xLabel"
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={tickFormatter}
        />

        <CartesianGrid vertical={false} />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      </AreaChartComp>
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
          tickFormatter={tickFormatter}
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
