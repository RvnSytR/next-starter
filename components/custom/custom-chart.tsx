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
import { useIsMobile } from "@/hooks/use-mobile";

// #region // * Types
type PieType = {
  config: ChartConfig;
  data: { nameKey: string; dataKey: number; fill?: string }[];
};

export type CustomChartProps = {
  customType: "pie";
  data: { label: string; chart: PieType }[];
};
// #endregion

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

export function CustomChart({ customType, data }: CustomChartProps) {
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
  const isMobile = useIsMobile();
  return (
    <ChartContainer
      config={config}
      className={cn(
        "mx-auto size-[12rem] lg:size-[18rem]",
        "[&_.recharts-pie-label-text]:hidden [&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000 md:[&_.recharts-pie-label-text]:flex",
      )}
    >
      <PieChart>
        <Pie
          data={data}
          nameKey="nameKey"
          dataKey="dataKey"
          innerRadius={isMobile ? 40 : 50}
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
