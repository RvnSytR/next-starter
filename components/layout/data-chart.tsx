"use client";

import { cn } from "@/lib/utils";
import { Pie, PieChart as PieChartComponent } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SectionTitle } from "./section";

export type ChartData = { nameKey: string; dataKey: number; fill?: string }[];

export function ChartCard({
  className,
  label,
  children,
}: {
  className?: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-md border p-4 lg:relative", className)}>
      <SectionTitle className="lg:absolute">{label}</SectionTitle>
      {children}
    </div>
  );
}

export function ChartPie({
  data,
  config,
}: {
  data: ChartData;
  config: ChartConfig;
}) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto size-[14rem] lg:size-[18rem] [&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000"
    >
      <PieChartComponent>
        <Pie
          data={data}
          nameKey="nameKey"
          dataKey="dataKey"
          innerRadius={50}
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
      </PieChartComponent>
    </ChartContainer>
  );
}
