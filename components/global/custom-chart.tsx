"use client";

import { Fragment } from "react";
import { Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "../ui/separator";

// #region // * Side Component
export function ChartCard({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex items-center gap-4 rounded-md border p-4", className)}
    >
      {label && <h5 className="mr-auto">{label}</h5>}
      {children}
    </div>
  );
}

export function CustomChartSeparator() {
  return (
    <Separator
      orientation="vertical"
      className="max-h-[8rem] lg:max-h-[12rem]"
    />
  );
}
// #endregion

export type CustomChartType = {
  customType: "pie";
  data: { label: string; chart: PieType }[];
};

type PieType = {
  config: ChartConfig;
  data: { nameKey: string; dataKey: number; fill?: string }[];
};

export function CustomChart({ customType, data }: CustomChartType) {
  switch (customType) {
    case "pie": {
      return (
        <ChartCard>
          {data.map((item, index) => (
            <Fragment key={index}>
              {index !== 0 && <CustomChartSeparator />}
              <div>
                <h5>{item.label}</h5>
                <ChartPie {...item.chart} />
              </div>
            </Fragment>
          ))}
        </ChartCard>
      );
    }
  }
}

function ChartPie({ config, data }: PieType) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto size-[14rem] lg:size-[18rem] [&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000"
    >
      <PieChart>
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
      </PieChart>
    </ChartContainer>
  );
}
